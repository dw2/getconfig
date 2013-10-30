var fs = require('fs'),
    path = require('path'),
    env = process.env.NODE_ENV || 'dev',
    colors = require('colors'),
    useColor = true,
    silent = false,
    color,
    config,
    configPath;

// set our color based on environment
switch (env) {
    case 'dev':         color = 'red'; break;
    case 'test':        color = 'yellow'; break;
    case 'production':  color = 'green'; break;
    default:            color = 'blue'; break;
}

// color
function c(str, color) {
    return useColor ? str[color] : str;
}

// build a file path to the config
configPath = __dirname.split('node_modules')[0] + env + '_config.json';

// try to read it
try {
    config = fs.readFileSync(configPath, 'utf-8');
} catch (e) {
    console.error(c("No config file found for %s", 'red'), env);
    console.error(c("We couldn't find anything at: %s", 'grey'), configPath);
    config = "{}";
}

try {
    config = JSON.parse(config);
    if (config.getconfig) {
        if (config.getconfig.hasOwnProperty('colors')) useColor = config.getconfig.colors;
        if (config.getconfig.hasOwnProperty('silent')) silent = config.getconfig.silent;
    } else {
        config.getconfig = {};
    }
    config.getconfig.env = env;

} catch (e) {
    console.error(c("Invalid JSON file", 'red'));
    console.error(c("Check it at:", 'grey') + c(" http://jsonlint.com", 'blue'));
    throw e;
}

// log out what we've got
if (!silent) console.log(c(c(env, color), 'bold') + c(' environment detected', 'grey'));

// export it
module.exports = config;
