const RiskData = require("../src/risk");
const randomUseragent = require('random-useragent');

function GenRiskData() {
    let riskDataInstance = new RiskData(
        randomUseragent.getRandom(),
        "en-US", // language
        24, // colorDepth
        4, // deviceMemory 
        8, // hardwareConcurrency
        360, // screenWidth
        640, // screenHeight
        360, // availScreenWidth
        640, // availScreenHeight
        -300, // timezoneOffset
        "America/Chicago", // timezone
        "MacIntel" // platform
    );
    
    return riskDataInstance.generate(); 
}

module.exports = GenRiskData; 