/// <reference path="..\..\typings\jquery\jquery.d.ts" />
/// <reference path="..\..\typings\bootstrap\bootstrap.d.ts" />
/// <reference path="..\..\typings\kendo-ui\kendo-ui.d.ts" />
/// <reference path=".\rsschannelreader.ts" />

module Athena{
    export class Bootstrapper {
       
        private static getBlogUrl() : string{
            return $('body').data('blog-rss');
        }
        
        private static getTagWrapper() : HTMLElement {
            return $('#blog-tags').get(0);
        }
        
        private static getNavList() : HTMLUListElement {
            return <HTMLUListElement>$('#athenaNavBar > ul').get(0);
        }
        
        constructor (){
        }       
        
        sideBar() : Bootstrapper {
            $('[data-toggle=offcanvas]').click(function() {
                $('.row-offcanvas').toggleClass('active');
            });
            return this;
        }
        
        tags(): Bootstrapper{
            var blogUrl:string = Bootstrapper.getBlogUrl();
            
            if(blogUrl === undefined){
                return this;
            }
                          
            this.getChannel(blogUrl).then((d)=>{
                 var items = d.getCategories(Athena.Utils.slugify);
                 this.addTagsToSidebar(items);
                 this.addTagsToNavbar(items);
            }); 
               
            return this;
        }
        
        private addTagsToNavbar(items:Array<Athena.Data.Model.IRssChannelCategoryMeta>): void {
            var target:HTMLUListElement = Bootstrapper.getNavList();
            var template = kendo.template('<a class="dropdown-toggle" data-toggle="dropdown" href="##">Tags<span class="fa fa-caret-down"></span></a>' +
                '<ul class="dropdown-menu">' +
                '# for (var i = 0; i < data.length; i++) { #' +
                    '<li><a href="#:data[i].url#">#:data[i].category# [#:data[i].articleCount#]</a></li>'+
                '# } #' +
                '</ul>');
                                        
            if(target !== undefined){
                var result:string = template(items);
                var menuItem:HTMLLIElement = document.createElement("li");
                menuItem.innerHTML = result;
                $(menuItem).addClass('dropdown');
                target.appendChild(menuItem);
            }
        }
        
        private addTagsToSidebar(items:Array<Athena.Data.Model.IRssChannelCategoryMeta>): void {
            var target:HTMLElement = Bootstrapper.getTagWrapper();
            var template:string = '<div><a href="#:url#">#:category# [#:articleCount#]</a></div>';
            
            if(target !== undefined){           
                $(target).kendoListView({
                    template: kendo.template(template),
                    dataSource: new kendo.data.DataSource(
                    {
                        data : items
                    })
                });
            }
        }
        
        private getChannel(blogUrl:string ): JQueryPromise<Athena.Data.Model.RssChannel>{
            var promise = $.Deferred();
            var cookie:any = window.sessionStorage.getItem('blogCategories');
            
            if(cookie != null){
                // console.log('using data in Session Storage for RSS feed');
                promise.promise();
                var rssChannel = Athena.Data.Context.RssChannelReader.parseJson(cookie);
                promise.resolve(rssChannel);
            }else{
                // console.log('doing AJAX RPC to retreive RSS feed');
                Athena.Data.Context.RssChannelReader.read(blogUrl)
                .fail(() => {
                    promise.fail();
                    promise.reject('failure');
                })
                .done((d)=>{
                    this.setChannel(d);
                    promise.promise();
                    promise.resolve(d);
                });
            }
            return promise;
        }
        
        private setChannel(categories:Athena.Data.Model.RssChannel){
            if(window.sessionStorage.getItem('blogCategories') === null){
                window.sessionStorage.setItem('blogCategories', JSON.stringify(categories));
            }
        }
        
        tooltips(): Bootstrapper {
            // enable bootstrap tooltips
            $('[data-toggle="tooltip"]').tooltip();
            return this;
        }
    }
}

$(document).ready(function(){
    new Athena.Bootstrapper().tooltips().sideBar().tags();
});

