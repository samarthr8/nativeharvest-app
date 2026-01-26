exports.submitContact = (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact received:", name, email, message);
  res.json({ success: true });
};

