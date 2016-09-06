'use strict';

let Pane = require('./Pane');

class CMSPane extends Pane {
    /**
     * Renders the toolbar
     *
     * @returns {HTMLElement} Toolbar
     */
    static renderToolbar() {
        function onClickLogOut() {
            document.cookie = 'token=';

            location.reload();
        }

        function onClickDashboard() {
            location = '/';
        }

        let $toolbar = _.div({class: 'pane-toolbar'},
            _.div({},
                _.label('Server'),
                _.button('Dashboard')
                    .click(onClickDashboard)
            ),
            _.div({},
                _.label('Session'),
                _.button('Log out')
                    .click(onClickLogOut)
            )
        );

        return $toolbar;
    }

    /**
     * Gets the render settings
     *
     * @returns {Object} Settings
     */
    static getRenderSettings() {
        return {
            label: 'HashBrown',
            sublabel: 'v' + app.version,
            route: '/',
            $icon: _.img({src: '/svg/logo_grey.svg', class: 'logo'}),
            toolbar: this.renderToolbar(),
            items: [
                {
                    name: 'Readme',
                    path: 'readme'
                },
                {
                    name: 'License',
                    path: 'license'
                }
            ]
        };
    }
}

module.exports = CMSPane;
