/// <reference path="..\..\typings\jquery\jquery.d.ts" />
/// <reference path="..\..\typings\bootstrap\bootstrap.d.ts" />
/// <reference path="..\..\typings\kendo-ui\kendo-ui.d.ts" />
/// <reference path=".\rsschannelreader.ts" />
var Athena;
(function (Athena) {
    var Bootstrapper = (function () {
        function Bootstrapper() {
        }
        Bootstrapper.getBlogUrl = function () {
            return $('body').data('blog-rss');
        };
        Bootstrapper.getTagWrapper = function () {
            return $('#blog-tags').get(0);
        };
        Bootstrapper.prototype.sideBar = function () {
            $('[data-toggle=offcanvas]').click(function () {
                $('.row-offcanvas').toggleClass('active');
            });
            return this;
        };
        Bootstrapper.prototype.tags = function () {
            var blogUrl = Bootstrapper.getBlogUrl();
            var target = Bootstrapper.getTagWrapper();
            var template = '<div><a href="#:url#">#:category# [#:articleCount#]</a></div>';
            if (blogUrl === undefined || target === undefined) {
                return this;
            }
            this.getChannel(blogUrl).then(function (d) {
                var items = d.getCategories(Athena.Utils.slugify);
                $(target).kendoListView({
                    template: kendo.template(template),
                    dataSource: new kendo.data.DataSource({
                        data: items
                    })
                });
            });
            return this;
        };
        Bootstrapper.prototype.getChannel = function (blogUrl) {
            var _this = this;
            var promise = $.Deferred();
            var cookie = window.sessionStorage.getItem('blogCategories');
            if (cookie != null) {
                // console.log('using data in Session Storage for RSS feed');
                promise.promise();
                var rssChannel = Athena.Data.Context.RssChannelReader.parseJson(cookie);
                promise.resolve(rssChannel);
            }
            else {
                // console.log('doing AJAX RPC to retreive RSS feed');
                Athena.Data.Context.RssChannelReader.read(blogUrl)
                    .fail(function () {
                    promise.fail();
                    promise.reject('failure');
                })
                    .done(function (d) {
                    _this.setChannel(d);
                    promise.promise();
                    promise.resolve(d);
                });
            }
            return promise;
        };
        Bootstrapper.prototype.setChannel = function (categories) {
            if (window.sessionStorage.getItem('blogCategories') === null) {
                window.sessionStorage.setItem('blogCategories', JSON.stringify(categories));
            }
        };
        Bootstrapper.prototype.tooltips = function () {
            // enable bootstrap tooltips
            $('[data-toggle="tooltip"]').tooltip();
            return this;
        };
        return Bootstrapper;
    })();
    Athena.Bootstrapper = Bootstrapper;
})(Athena || (Athena = {}));
$(document).ready(function () {
    new Athena.Bootstrapper().tooltips().sideBar().tags();
});
//# sourceMappingURL=athena.js.map