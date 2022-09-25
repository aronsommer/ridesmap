//$(document).ready(function() {
(function exchangeStravaTokens() {

    const currentURL = new URL(location.href);
    // Check for search parameter 'code' - If it exists, use it to acquire
    // tokens from Strava.
    if (currentURL.searchParams.has('code')) {
        const codein = currentURL.searchParams.get('code');
        //console.log(codein);
        $.ajax({
            url: 'https://www.hauptstadtprojekt.ch/ridesmap/php/oauth-flow.php?action=token',
            method: 'POST',
            data: {
                code: codein,
                grant: 'grant',
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {

                const accessToken = data && data.access_token;
                const refreshToken = data && data.refresh_token;
                const expiresAt = data && data.expires_at;
                //alert(accessToken+expiresAt);
                // Ensure that the tokens were returned in the response
                if (accessToken.length > 0) {
                    Cookies.set('STRAVA_ACCESS_TOKEN_NAME', accessToken, {
                        expires: new Date(expiresAt * 1000)
                    });
                }


                if (refreshToken.length > 0) {
                    Cookies.set('STRAVA_REFRESH_TOKEN_NAME', refreshToken);
                }

                // Remove the parameters from the url
                const cleanURL = location.protocol + '//' + location.host + location.pathname;
                location.replace(cleanURL);
                $("#get-activities").show();
                $("#strava-button-img-a").hide();
                tryGetStravaActivities();
            },
            error: function(jqXHR, textStatus, error) {
                // If the token request fails, that can be handled here
                console.log('Could not get tokens from Strava: ' + JSON.stringify(jqXHR));
            }
        })
    }
})();

/*
   getStravaActivities(function (err, polylines) {
       if (err) {
         // Handle errors
         console.error(err);
         return;
       }

       document.querySelector('#strava-json').textContent = JSON.stringify(polylines, 4);
     });
*/




/*

 * The main script - Will login to strava if necessary, and if user is already logged
 * in, will retrieve a list of activities.
 *
 * Activities will be passed to the second parameter of the onComplete callback. The
 * first parameter will be an error object if a problem was encountered, or null otherwise.
 *
 * @param {Function} onComplete - Callback which will be called after the
 */
function getStravaActivities(onComplete) {
    'use strict';

    let activities;
    let currentPage;
    let polylines;

    /**
     * Request user's activities from Strava
     *
     * @param {Function} callback - Called once the request has been completed
     * @param {*} _continuing - Internally used for recursive calls, for paging purposes
     */
    var sum_activities = 0;
    function getActivities(callback, _continuing) {
        //alert('enter into getativities');

        const accessToken = Cookies.get('STRAVA_ACCESS_TOKEN_NAME');
        const continuationStr = 'continue';
        //alert('accesstoken in activities'+accessToken);
        // If this is an initial call, reset activities and page number,
        // so as not to append the new response to the previous results
        if (_continuing !== continuationStr) {
            activities = [];
            currentPage = 1;
        }

        $.ajax('https://www.strava.com/api/v3/athlete/activities', {
            method: 'GET',
            data: {
                page: currentPage,
                per_page: 200,
                access_token: accessToken,
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                //alert('get activities success'+currentPage);
                for (let i = 0; i < data.length; i++) {
                    activities.push(data[i]);
                }
                sum_activities = sum_activities + data.length;
                $("#loadertext").html(sum_activities + " activities loaded");
                if (data.length > 0) {
                    currentPage += 1;
                    getActivities(callback, continuationStr);
                } else {
                    callback();
                }
            },
            error: function(jqXHR, textStatus, error) {
                // If the token request fails, that can be handled here
                //alert('Could not get tokens from Strava: '+JSON.stringify(jqXHR)+textStatus+error);
            },

            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });
    }

    /**
     * Initiates the OAuth flow with Strava
     */
    function stravaLogin() {
        //const url = new URL('https://www.strava.com/oauth/authorize');
        const url = new URL('https://www.hauptstadtprojekt.ch/ridesmap/php/oauth-flow.php?action=auth');
        //console.log(url);
        location.replace(url);
    };

    /**
     * Use the given refresh token to acquire a new access token from the API
     *
     * @param {string} refreshToken - The refresh token to use to retrieve the refreshed access token
     * @param {*} callback - Completion callback
     */
    function refreshAccessToken(refreshToken, callback) {
        function onSuccess(data, textStatus, jqXHR) {
            //console.log(data);
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresAt = data.expires_at;

            if (accessToken.length > 0) {
                Cookies.set('STRAVA_ACCESS_TOKEN_NAME', accessToken, {
                    expires: new Date(expiresAt * 1000)
                });
            }

            if (refreshToken.length > 0) {
                Cookies.set('STRAVA_REFRESH_TOKEN_NAME', refreshToken);
            }

            callback();
        };

        $.ajax({
            url: 'https://www.hauptstadtprojekt.ch/ridesmap/php/oauth-flow.php?action=refresh_token',
            method: 'POST',
            data: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            dataType: 'json',
            success: onSuccess,
            error: function(jqXHR, textStatus, error) {
                callback(new Error('Could not refresh access token: ' + error))
            }
        });
    };

    /**
     * If there is a valid access or refresh token, this function will request a list
     * of the user's activities, then convert the results into GeoJson polylines and
     * call the onComplete callback, passing the results.
     *
     * If no access token is found, the user will be redirected to log in to strava.
     */
    function tryGetStravaActivities() {

        let accessToken = Cookies.get('STRAVA_ACCESS_TOKEN_NAME');
        const refreshToken = Cookies.get('STRAVA_REFRESH_TOKEN_NAME');

        // If no strava tokens are found, initiate the OAuth flow and exit the function.
        if (accessToken == undefined && refreshToken == undefined) {
            stravaLogin();
            return;
        }

        function onSuccess() {
            polylines = activities
                .filter(function(activity) {
                    return activity.map && activity.map.summary_polyline && typeof activity.map.summary_polyline === 'string';
                })
                .map(function(activity) {
                    //console.log(activity);
                    return GeoJSONPolyline.decode({
                        type: 'LineString',
                        coordinates: activity.map.summary_polyline,
                        properties: {
                            activityID: activity.id,
                            distance: activity.distance,
                            location_city: activity.location_city,
                            location_country: activity.location_country,
                            type: activity.type,
                            start_date: activity.start_date,
                            start_latitude: activity.start_latlng[0],
                            start_longitude: activity.start_latlng[1],
                            name: activity.name,
                            elevation_gain: activity.total_elevation_gain
                        }
                    });
                });

            onComplete(null, polylines);
        }

        // If the strava token has expired, get a new token using the refresh token
        //console.log(refreshToken);
        if (accessToken == undefined && refreshToken != undefined) {
            refreshAccessToken(refreshToken, function(err) {
                if (err) {
                    // If there was a problem renewing the access token, handle that here.
                    console.error(err);
                    return;
                }

                // Request activities from Strava using the newly acquired access token.
                getActivities(onSuccess);
            });

            return;
        }

        getActivities(onSuccess);
    }

    /**
     * Initiate the request / login process
     */
    tryGetStravaActivities();
}
