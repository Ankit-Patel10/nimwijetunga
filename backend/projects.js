const appendQuery = require('append-query')
const request = require('request-promise');
require('dotenv').config()

async function get_profile() {

    let uri = 'https://api.github.com/user/repos';

    let params = {
        access_token: process.env.github_key
    };

    let url = appendQuery(uri, params);

    return request({
        "method": "GET",
        "uri": url,
        "json": true,
        "headers": {
            'User-Agent': 'Personal-Website'
        },
    });
}

module.exports = {
    get_projects: async function (projects) {
        var profile = await get_profile().catch((err) => { return false });
        return new Promise((resolve, reject) => {

            if (!profile) {
                reject(false);
            }

            var projects_filt = {};
            projects_filt['projects'] = []
            var keys = Object.keys(projects);

            for (var i in profile) {
                let name = profile[i]['name'];
                if (keys.includes(name)) {
                    let project = {
                        name: projects[name],
                        desc: profile[i]['description'],
                        url: profile[i]['html_url'],
                        img: 'res/' + name + '.png'
                    };
                    projects_filt['projects'].push(project);
                }
            }
            if (!projects_filt || !projects_filt['projects'] || projects_filt['projects'].length != 4) {
                reject(false);
            }
            resolve(projects_filt);
        })
    }
}
