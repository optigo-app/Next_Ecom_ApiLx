export const localHosts = [
  "localhost",
  "nxtsonasons.web",
  "nxthoq.web",
  "nxtelvee.web",
  "nxtmobileapp.web",
  "nzen",
  "nxt10.optigoapps.com",
  "nxt09.optigoapps.com",
  "beluxjewel.web",
  "beluxjewel.web",
  "nxtjulian.web",
];

export const isLocalHost = (cleanHost) => {
  return (
    localHosts.includes(cleanHost) ||
    cleanHost.endsWith(".ngrok-free.app") ||
    cleanHost.endsWith(".ngrok.io")
  );
};
