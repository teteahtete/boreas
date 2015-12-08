/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />

module Athena.Data.Context {
	export class RssChannelReader {
			
		static read(url:string): JQueryPromise<Athena.Data.Model.RssChannel>{
			return $.get(url)
				.then((data:string) => this.parseXml(data), () => { return new Athena.Data.Model.RssChannel();})
			;
		}
		
		static parseXml(data:string) : Athena.Data.Model.RssChannel {
			var channel:JQuery = $(data).find('channel').first();
			var result:Athena.Data.Model.RssChannel = new Athena.Data.Model.RssChannel();
			
			result.title = channel.children('title').text();
			result.description = {
				link: channel.children('link').text(),
				generator: channel.children('generator').text(),
				lastBuildDate: new Date(Date.parse(channel.children('lastBuildDate').text()))
			};
			result.items = _.map(channel.find('item'), RssChannelReader.parseRssItem);
			
			return result;
		}
		
		static parseJson(data:string){
			var result:Athena.Data.Model.RssChannel = new Athena.Data.Model.RssChannel();
			var item = <Athena.Data.Model.RssChannel>JSON.parse(data);
			result.title = item.title;
			result.description = item.description;
			result.items = item.items;
			return result;
		}
		
		static parseRssItem(elem: JQuery, key: string, list: _.Dictionary<JQuery>) : Athena.Data.Model.RssChannelItem{
			var result = new Athena.Data.Model.RssChannelItem();
			
			result.title = $(elem).children('title').text();
			result.description = $(elem).children('description').text();
			result.guid = $(elem).children('guid').text();
			result.link = $(elem).children('link').text();
			result.content = $(elem).children('content').text();
			result.creator= $(elem).children('dc\\:creator').text();
			result.pubDate = new Date(Date.parse($(elem).children('pubDate').text()));
			result.categories = _.map($(elem).children('category'), RssChannelReader.parseRssItemCategories);
			
			return result;
		}
		
		static parseRssItemCategories(elem: JQuery, key: string, list: _.Dictionary<JQuery>) : string {
			return $(elem).text();		
		}
	}
}

module Athena.Data.Model {
	export class RssChannelItem {
		title:string;
		description:string;
		link:string;
		guid:string;
		content:string;
		pubDate:Date;
		creator:string;
		categories: Array<string>;
		constructor() {
			this.categories = new Array<string>();
		}
	}
	
	export interface IRssChannelDescription {
		link:string;
		generator:string;
		lastBuildDate: Date;
	}
	
	export interface IRssChannelCategoryMeta{
		category:string;
		articleCount:number;
		url:string;
	}
	
	export class RssChannel {
		title: string;
		description: IRssChannelDescription;
		items: Array<RssChannelItem>;
		
		getCategories(slugify:{ (text: string): string }) :Array<IRssChannelCategoryMeta>{
			var result = new Array<IRssChannelCategoryMeta>();
			var posts = _.filter(this.items, (post) => { return post.categories.length > 0;});
			var categories:Array<string> = _.uniq(_.flatten(_.pluck(posts, 'categories')));
			
			result = _.map(categories, (category:string)=>{
				return {
					category: category,
					articleCount: this.getCategoryCount(posts, category),
					url: '/tag/' + slugify(category)
				}
			});
			return result;
		}
		
		private getCategoryCount(posts:Array<RssChannelItem>, category:string): number{
			var result = _.reduce<RssChannelItem,number>(posts, (prev:number,current:RssChannelItem)=>{					
					return _.contains(current.categories, category) ? ++prev : prev;
				},0);
			return result;
		}
	}
}