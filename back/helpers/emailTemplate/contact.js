const email = process.env.EMAIL

module.exports = (from, subject, text) => {
    return {
       from,
       to: email ,
       subject,
       html: `<p>${text}</p>`
     };
   };
   