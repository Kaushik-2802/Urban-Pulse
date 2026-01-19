// export const getUserLocation = () => 
//     new Promise((res,rej)=>{
//         navigator.geolocation.getCurrentPosition(
//             pos=>
//                 res({
//                     lat: pos.coords.latitude,
//                     lon: pos.coords.longitude,
//                 }),
//             err=>rej(err)
//         );
//     })

// export const getUserLocation = () =>
//   new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude, accuracy } = pos.coords;

//         resolve({
//           lat: latitude,
//           lon: longitude,
//           accuracy, 
//         });
//       },
//       (err) => reject(err),
//       {
//         enableHighAccuracy: true, 
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   });

// export const getUserLocation = () =>
//   new Promise((res, rej) => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         if (pos.coords.accuracy > 100) {
//           rej("Low accuracy location rejected");
//           return;
//         }

//         res({
//           lat: pos.coords.latitude,
//           lon: pos.coords.longitude,
//           accuracy: pos.coords.accuracy,
//         });
//       },
//       rej,
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   });



// export const getUserLocation = () => {
//   // 1️⃣ Use cached location first (Google-style)
//   const cached = sessionStorage.getItem("userLocation");
//   if (cached) {
//     return Promise.resolve(JSON.parse(cached));
//   }

//   // 2️⃣ Otherwise detect location
//   return new Promise((res, rej) => {
//     const options = {
//       enableHighAccuracy: true,
//       timeout: 8000,
//       maximumAge: 0,
//     };

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude, accuracy } = pos.coords;

//         // 3️⃣ Accept good GPS immediately
//         if (accuracy <= 100) {
//           const loc = { lat: latitude, lon: longitude, accuracy };
//           sessionStorage.setItem("userLocation", JSON.stringify(loc));
//           return res(loc);
//         }

//         // 4️⃣ Retry once for better accuracy
//         setTimeout(() => {
//           navigator.geolocation.getCurrentPosition(
//             (retryPos) => {
//               const a = retryPos.coords.accuracy;
//               const loc = {
//                 lat: retryPos.coords.latitude,
//                 lon: retryPos.coords.longitude,
//                 accuracy: a,
//               };

//               // 5️⃣ Accept second-best location
//               if (a <= 500) {
//                 sessionStorage.setItem("userLocation", JSON.stringify(loc));
//                 res(loc);
//               } else {
//                 rej("Unable to get accurate location");
//               }
//             },
//             rej,
//             options
//           );
//         }, 1500);
//       },
//       rej,
//       options
//     );
//   });
// };


export const getUserLocation = () => {
  const cached = sessionStorage.getItem("userLocation");
  if (cached) {
    return Promise.resolve(JSON.parse(cached));
  }

  return new Promise((res) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        const loc = {
          lat: latitude,
          lon: longitude,
          accuracy,
          approximate: accuracy > 500,
        };

        sessionStorage.setItem("userLocation", JSON.stringify(loc));
        res(loc);
      },
      () => {
        // Absolute fallback — Hyderabad center (never fail UI)
        res({
          lat: 17.385,
          lon: 78.4867,
          accuracy: 5000,
          approximate: true,
        });
      },
      options
    );
  });
};

