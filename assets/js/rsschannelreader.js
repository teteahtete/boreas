/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
var Athena;
(function (Athena) {
    var Data;
    (function (Data) {
        var Context;
        (function (Context) {
            var RssChannelReader = (function () {
                function RssChannelReader() {
                }
                RssChannelReader.read = function (url) {
                    var _this = this;
                    return $.get(url)
                        .then(function (data) { return _this.parseXml(data); }, function () { return new Athena.Data.Model.RssChannel(); });
                };
                RssChannelReader.parseXml = function (data) {
                    var channel = $(data).find('channel').first();
                    var result = new Athena.Data.Model.RssChannel();
                    result.title = channel.children('title').text();
                    result.description = {
                        link: channel.children('link').text(),
                        generator: channel.children('generator').text(),
                        lastBuildDate: new Date(Date.parse(channel.children('lastBuildDate').text()))
                    };
                    result.items = _.map(channel.find('item'), RssChannelReader.parseRssItem);
                    return result;
                };
                RssChannelReader.parseJson = function (data) {
                    var result = new Athena.Data.Model.RssChannel();
                    var item = JSON.parse(data);
                    result.title = item.title;
                    result.description = item.description;
                    result.items = item.items;
                    return result;
                };
                RssChannelReader.parseRssItem = function (elem, key, list) {
                    var result = new Athena.Data.Model.RssChannelItem();
                    result.title = $(elem).children('title').text();
                    result.description = $(elem).children('description').text();
                    result.guid = $(elem).children('guid').text();
                    result.link = $(elem).children('link').text();
                    result.content = $(elem).children('content').text();
                    result.creator = $(elem).children('dc\\:creator').text();
                    result.pubDate = new Date(Date.parse($(elem).children('pubDate').text()));
                    result.categories = _.map($(elem).children('category'), RssChannelReader.parseRssItemCategories);
                    return result;
                };
                RssChannelReader.parseRssItemCategories = function (elem, key, list) {
                    return $(elem).text();
                };
                return RssChannelReader;
            })();
            Context.RssChannelReader = RssChannelReader;
        })(Context = Data.Context || (Data.Context = {}));
    })(Data = Athena.Data || (Athena.Data = {}));
})(Athena || (Athena = {}));
var Athena;
(function (Athena) {
    var Data;
    (function (Data) {
        var Model;
        (function (Model) {
            var RssChannelItem = (function () {
                function RssChannelItem() {
                    this.categories = new Array();
                }
                return RssChannelItem;
            })();
            Model.RssChannelItem = RssChannelItem;
            var RssChannel = (function () {
                function RssChannel() {
                }
                RssChannel.prototype.getCategories = function (slugify) {
                    var _this = this;
                    var result = new Array();
                    var posts = _.filter(this.items, function (post) { return post.categories.length > 0; });
                    var categories = _.uniq(_.flatten(_.pluck(posts, 'categories')));
                    result = _.map(categories, function (category) {
                        return {
                            category: category,
                            articleCount: _this.getCategoryCount(posts, category),
                            url: '/tag/' + slugify(category)
                        };
                    });
                    return result;
                };
                RssChannel.prototype.getCategoryCount = function (posts, category) {
                    var result = _.reduce(posts, function (prev, current) {
                        return _.contains(current.categories, category) ? ++prev : prev;
                    }, 0);
                    return result;
                };
                return RssChannel;
            })();
            Model.RssChannel = RssChannel;
        })(Model = Data.Model || (Data.Model = {}));
    })(Data = Athena.Data || (Athena.Data = {}));
})(Athena || (Athena = {}));
//# sourceMappingURL=rsschannelreader.js.map