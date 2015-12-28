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
        Bootstrapper.getNavList = function () {
            return $('#athenaNavBar > ul').get(0);
        };
        Bootstrapper.getPrevNextSections = function () {
            var result = new Array();
            $('section.next-post, section.prev-post').each(function (index, elem) {
                result.push(elem);
            });
            return result;
        };
        Bootstrapper.prototype.tags = function () {
            var _this = this;
            var blogUrl = Bootstrapper.getBlogUrl();
            if (blogUrl === undefined) {
                return this;
            }
            this.getChannel(blogUrl).then(function (d) {
                var items = d.getCategories(Athena.Utils.slugify);
                _this.addTagsToSidebar(items);
                _this.addTagsToNavbar(items);
            });
            return this;
        };
        Bootstrapper.prototype.fixPostPageLinks = function () {
            var items = Bootstrapper.getPrevNextSections();
            if (items.length == 1) {
                $(items[0]).parent().parent().removeClass('col-sm-6');
            }
            return this;
        };
        Bootstrapper.prototype.addTagsToNavbar = function (items) {
            var target = Bootstrapper.getNavList();
            var template = kendo.template('<a class="dropdown-toggle" data-toggle="dropdown" href="##">Categories <span class="fa fa-tag"></span></a>' +
                '<ul class="dropdown-menu">' +
                '# for (var i = 0; i < data.length; i++) { #' +
                '<li><a href="#:data[i].url#">#:data[i].category# [#:data[i].articleCount#]</a></li>' +
                '# } #' +
                '</ul>');
            if (target !== undefined) {
                var result = template(items);
                //var menuItem:HTMLLIElement = document.createElement("li");
                var menuItem = target.firstElementChild;
                menuItem.innerHTML = result;
                $(menuItem).addClass('dropdown');
            }
        };
        Bootstrapper.prototype.addTagsToSidebar = function (items) {
            var target = Bootstrapper.getTagWrapper();
            var template = '<div><a href="#:url#">#:category# [#:articleCount#]</a></div>';
            if (target !== undefined) {
                $(target).kendoListView({
                    template: kendo.template(template),
                    dataSource: new kendo.data.DataSource({
                        data: items
                    })
                });
            }
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
    new Athena.Bootstrapper()
        .tooltips()
        .fixPostPageLinks()
        .tags();
});
//# sourceMappingURL=athena.js.map