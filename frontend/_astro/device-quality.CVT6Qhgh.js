const o=()=>{if(typeof navigator>"u")return!1;const e=navigator,r=e.deviceMemory,n=e.hardwareConcurrency??8;return e.connection?.saveData===!0||typeof r=="number"&&r<=4||n<=4};export{o as i};
