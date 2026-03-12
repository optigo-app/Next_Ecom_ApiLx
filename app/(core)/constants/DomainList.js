export const localHosts = ["localhost", "nxtsonasons.web", "nxthoq.web", "nxtmobileapp.web", "nzen", "nxt10.optigoapps.com"];



export const isLocalHost = (cleanHost) => {
  return (
    localHosts.includes(cleanHost) ||
    cleanHost.endsWith(".ngrok-free.app") ||
    cleanHost.endsWith(".ngrok.io")
  );
};