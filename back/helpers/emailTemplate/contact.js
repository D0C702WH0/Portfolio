const email = process.env.EMAIL;

module.exports = (from, subject, text) => {
  return {
    from: `Portoflio${email}`,
    to: email,
    subject,
    html: `<p>${text}</p><p>${from}</p>`
  };
};
