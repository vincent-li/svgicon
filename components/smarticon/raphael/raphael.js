// ┌─────────────────────────────────────────────────────────────────────┐ \\
// │ "Raphaël 2.1.0" - JavaScript Vector Library                         │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
// │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
// └─────────────────────────────────────────────────────────────────────┘ \\

// This module combines the core raphael module with the svg and vml modules
// to return a complete raphael object. Apps that want to use Raphaël as an
// AMD module should reference this file.
//
// Apps that want to load a plain old script that exports window.raphael
// should use the combined raphael.js file.

/*kissy raphael 使用kissy模块化方法重写raphael*/
//@author bashao @email vincent.liwq@gmail.com

KISSY.add('components/smarticon/raphael/raphael', function(S,R) {
    return R.ninja();
}, {
    requires: ['./raphael.core', './raphael.svg', './raphael.vml']
});
