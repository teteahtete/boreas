/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
var Athena;
(function (Athena) {
    var Utils;
    (function (Utils) {
        function slugify(text) {
            /// src: https://gist.github.com/mathewbyrne/1280286
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-') // Replace multiple - with single -
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, ''); // Trim - from end of text
        }
        Utils.slugify = slugify;
    })(Utils = Athena.Utils || (Athena.Utils = {}));
})(Athena || (Athena = {}));
//# sourceMappingURL=utils.js.map