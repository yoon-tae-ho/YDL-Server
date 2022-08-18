import Video from "../models/Video";

export const getVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(
      id,
      "belongIn embededCode videoSrc videoType trackSrc trackKind trackSrclang thumbnailUrl player"
    ).lean();

    // error process
    if (!video) {
      return res.sendStatus(404);
    }

    return res.status(200).json(video);
  } catch (error) {
    console.log(error);
  }
};

export const getNextVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id, "belongIn videoIndex").populate({
      path: "belongIn",
      select: "_id videos",
      populate: {
        path: "videos",
        select: "_id videoIndex",
      },
    });

    if (!video) {
      return res.sendStatus(404);
    }

    const nextVideo = video.belongIn.videos.find(
      (element) => element.videoIndex === video.videoIndex + 1
    );

    let isLast = false;

    if (!nextVideo) {
      isLast = true;
    }

    return res.json({ isLast, nextId: nextVideo?._id });
  } catch (error) {
    console.log(error);
  }
};
