// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorblindPlugin = require("..");
var colorblind = require('color-blind');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Color Transforms', function() {
  var postCss;

  beforeEach(function() {
    postCss = postcss();
  });

  it('should do a simple hex deuteranopia transform', function() {
    postCss.use(colorblindPlugin('deuteranopia'));
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a simple hex achromatopsia transform', function() {
    postCss.use(colorblindPlugin('achromatopsia'));
    var caseColor = "#D929E2";
    var input = `
    .some-color {
      border: 3px ${caseColor} solid;
      font-size: 12px;
    }
    `;

    var answer = `
    .some-color {
      border: 3px ${colorblind.achromatopsia(caseColor)} solid;
      font-size: 12px;
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a simple named color deuteranopia transform', function() {
    postCss.use(colorblindPlugin('deuteranopia'));
    var caseColor = "red";
    var ansColor = colorblind.deuteranopia('#f00');
    var input = `
    .some-color {
      border: 3px ${caseColor} solid;
      font-size: 12px;
    }
    `;

    var answer = `
    .some-color {
      border: 3px ${ansColor} solid;
      font-size: 12px;
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a multi tritanopia transform', function() {
    postCss.use(colorblindPlugin('tritanopia'));
    var caseColor = "#D929E2";
    var caseColor2 = "#B28200";
    var caseColor3 = 'green';
    var ansColor3 = colorblind.tritanopia('#0f0');
    var input = `
    .some-color {
      border: 3px ${caseColor} dashed;
      color: ${caseColor2};
      font-size: 12px;
    }
    #other-thing {
      border-color: ${caseColor3}
    }
    `;

    var answer = `
    .some-color {
      border: 3px ${colorblind.tritanopia(caseColor)} dashed;
      color: ${colorblind.tritanopia(caseColor2)};
      font-size: 12px;
    }
    #other-thing {
      border-color: ${ansColor3}
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });


});

describe('Setup', function() {
  var postCss;

  beforeEach(function() {
    postCss = postcss();
  });

  it('should assume deuteranopia given no parameter', function() {
    postCss.use(colorblindPlugin());
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should handle weird capitalization', function() {
    postCss.use(colorblindPlugin('DEuTerAnopiA'));
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should handle weird whitespace', function() {
    postCss.use(colorblindPlugin(' deuteranopia      '));
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should handle capitalized color names', function() {
    postCss.use(colorblindPlugin('deuteranopia'));
    var caseColor = "BLuE";
    var ansColor = colorblind.deuteranopia('#00f');
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${ansColor};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should throw an error on a bad method name', function() {
    expect(function() {
      postCss.use(colorblindPlugin('bad method name'));
    })
    .to.throw();
  });


});
