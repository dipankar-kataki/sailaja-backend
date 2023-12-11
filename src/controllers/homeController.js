import enquiryModel from "../models/enquiryModel.js";
import projectModel from "../models/projectModel.js";

export const homePage = async (req, res, next) => {
  try {
    const totalProjects = await projectModel.countDocuments();
    const completedProjects = await projectModel.countDocuments({
      status: "completed",
    });
    const upcomingProjects = await projectModel.countDocuments({
      status: "upcoming",
    });
    const ongoingProjects = await projectModel.countDocuments({
      status: "ongoing",
    });

    // Assuming you have properties like 'contacted' and 'enquiry' in your model
    const totalContacted = await enquiryModel.countDocuments({
      madeContact: true,
    });
    const totalEnquiry = await enquiryModel.countDocuments({
      madeEnquiry: true,
    });

    return res.status(200).json({
      data: {
        totalProjects,
        completedProjects,
        upcomingProjects,
        ongoingProjects,
        totalContacted: totalContacted.length ? totalContacted : 0,
        totalEnquiry: totalEnquiry.length ? totalEnquiry : 0,
      },
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: 500 });
  }
};
