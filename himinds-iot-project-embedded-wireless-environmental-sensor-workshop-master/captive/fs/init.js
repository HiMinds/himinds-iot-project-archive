load('api_sys.js');
load('api_timer.js');

let getInfo = function () {
    return JSON.stringify({
        data: {
            total_ram: Sys.total_ram(),
            free_ram: Sys.free_ram()
        }
    });
};

// Create timer to print system info every 3 seconds and 
Timer.set(3000, true, function () {
    print('uptime:', Sys.uptime(), getInfo());
}, null);
