/// <reference path="..\..\typings\jquery\jquery.d.ts" />
/// <reference path="..\..\typings\bootstrap\bootstrap.d.ts" />
$(document).ready(function () {
    // setup 'sidebar' so it will collapse
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
    $('[data-toggle="tooltip"]').tooltip();
});
//# sourceMappingURL=athena.js.map