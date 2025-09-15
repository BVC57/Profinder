const cron = require("node-cron");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Professional = require("../models/AdminProfile");
const ServiceRequest = require("../models/UserRequest");
const Subscription = require("../models/AdminModel");

// 🔹 Mail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chauhanbhadresh57@gmail.com",
    pass: 'zpqw mfng zvxd jxhw'
  },
});

function startCronJobs() {
  console.log("cron jobs started...");

  // ✅ Job 1: Check overdue services every midnight
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();
    const overdueRequests = await ServiceRequest.find({
      status: "accepted",
      estimatedCompletionDate: { $lt: today },
      completedDate: null,
    });

    for (let req of overdueRequests) {
      const user = await User.findById(req.userId);
      const professional = await Professional.findById(req.professionalId);

      if (!user || !professional) continue;

      // Email to User
      await transporter.sendMail({
        from: "chauhanbhadresh57@gmail.com",
        to: user.email,
        subject: "Service Delay Apology",
        text: `Sorry ${user.name}, your service request is delayed. Please connect for better services.`,
      });

      // Email to Professional
      await transporter.sendMail({
        from: "chauhanbhadresh57@gmail.com",
        to: professional.email,
        subject: "Account Warning",
        text: `Dear ${professional.name}, you have not completed a user request. Your account is at risk of being frozen.`,
      });
    }
  });

  // ✅ Job 2: Refund after 30 days if not completed
  cron.schedule("0 1 * * *", async () => {
    const today = new Date();
    const cutoff = new Date(today.setDate(today.getDate() - 30));

    const refundRequests = await ServiceRequest.find({
      status: "accepted",
      completedDate: null,
      refunded: false,
      acceptedDate: { $lt: cutoff },
    });

    for (let req of refundRequests) {
      const user = await User.findById(req.userId);
      if (!user) continue;

      // Refund money
      user.balance += req.amount;
      await user.save();

      req.refunded = true;
      req.status = "refunded";
      await req.save();

      // Refund email
      await transporter.sendMail({
        from: "chauhanbhadresh57@gmail.com",
        to: user.email,
        subject: "Refund Processed",
        text: `Hello ${user.name}, your refund of ₹${req.amount} has been credited to your account.`,
      });
    }
  });

  // ✅ Job 3: Subscription Plan Expiry & Reminder
  cron.schedule("0 2 * * *", async () => {
    const today = new Date();

    const subscriptions = await Subscription.find({ isExpired: false }).populate("adminId");
    for (let sub of subscriptions) {
      if (!sub.adminId?.email) continue;

      const daysLeft = Math.ceil((sub.endDate - today) / (1000 * 60 * 60 * 24));

      // Reminder 1 day before expiry
      if (daysLeft === 1) {
        await transporter.sendMail({
          from: "chauhanbhadresh57@gmail.com",
          to: sub.adminId.email,
          subject: "⚠️ Subscription Expiry Reminder",
          text: `Hello ${sub.adminId.name}, your ${sub.planName} plan expires tomorrow. Please renew to continue services.`,
        });
      }

      // Expire plan if endDate passed
      if (sub.endDate < today) {
        sub.isExpired = true;
        await sub.save();

        await transporter.sendMail({
          from: "chauhanbhadresh57@gmail.com",
          to: sub.adminId.email,
          subject: "❌ Subscription Expired",
          text: `Hello ${sub.adminId.name}, your ${sub.planName} plan has expired. Please renew to continue using premium features.`,
        });
      }
    }
  });
}

module.exports = startCronJobs;
