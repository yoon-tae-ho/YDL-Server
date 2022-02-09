import Instructor from "./models/Instructor";
import Lecture from "./models/Lecture";
import Video from "./models/Video";

export const fakeData = async (req, res) => {
  const newDate = {
    title: "Theory of City Form",
    instructor: "Prof. Julian Beinart",
    institute: "MIT",
    description:
      "This course covers theories about the form that settlements should take and attempts a distinction between descriptive and normative theory by examining examples of various theories of city form over time. Case studies will highlight the origins of the modern city and theories about its emerging form, including the transformation of the nineteenth-century city and its organization. Through examples and historical context, current issues of city form in relation to city-making, social structure, and physical design will also be discussed and analyzed.",
    topics: [
      "Architecture > Architectural Design",
      "Urban Studies",
      "Sociology > Community Development",
    ],
    courseId: "4.241J / 11.330J",
    asTaughtIn: "Spring 2013",
    level: "Graduate",
    videos: [
      {
        title: "Lec 1: Introduction",
        description:
          "This lecture covers the motivations for the course, an introduction of urban history, and the role of cities throughout human history. The professor gives a brief explanation of each topic that is to be covered in the course.",
        thumbnailUrl: "https://img.youtube.com/vi/k2_wuThLG6o/default.jpg",
        embededCode:
          '<iframe src="https://www.youtube.com/v/k2_wuThLG6o" height=325 width=545 frameborder=0></iframe>',
        videoLink:
          "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/video-lectures/lec-1-introduction",
      },
      {
        title: "Lec 2: Normative Theory I: The City as Supernatural",
        description:
          "This lecture focuses on the cosmic model of the city, and the city as a consciousness and expression of religion. Some examples discussed include Solomon's temple, Eliade's depiction of the archaic man, feng shui, Athens, and barays.",
        thumbnailUrl: "https://img.youtube.com/vi/rbTLRBdEcqA/default.jpg",
        embededCode:
          '<iframe src="https://www.youtube.com/v/rbTLRBdEcqA" height=325 width=545 frameborder=0></iframe>',
        videoLink:
          "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/video-lectures/lec-2-normative-theory-i-the-city-as-supernatural",
      },
      {
        title: "Lec 3: Normative Theory II: The City as Machine",
        description:
          "This lecture covers the machine model, characterized by visual economy, decentralization, and urbanizing at low costs. Comparisons are drawn between the cosmic model, with examples including colonial expansion in Greece, Roman cities, and French bastides.",
        thumbnailUrl: "https://img.youtube.com/vi/oBKDFgLoR9o/default.jpg",
        embededCode:
          '<iframe src="https://www.youtube.com/v/oBKDFgLoR9o" height=325 width=545 frameborder=0></iframe>',
        videoLink:
          "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/video-lectures/lec-3-normative-theory-ii-the-city-as-machine",
      },
    ],
  };

  const {
    title,
    instructor,
    institute,
    description,
    topics,
    courseId,
    asTaughtIn,
    level,
    videos,
  } = newDate;

  try {
    const lecture = await Lecture.create({
      title,
      institute,
      description,
      topics,
      courseId,
      asTaughtIn,
      level,
    });

    const dbInstructor = await Instructor.create({
      name: instructor,
      lectures: [lecture._id],
    });

    videos.forEach(async (video, index) => {
      const dbVideo = await Video.create({
        title: video.title,
        instructors: [dbInstructor._id],
        institute,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        embededCode: video.embededCode,
        videoLink: video.videoLink,
        belongIn: lecture._id,
      });

      lecture.videos.push(dbVideo._id);

      if (index === 2) {
        lecture.instructors.push(dbInstructor._id);
        lecture.save();
      }
    });

    return res.send("Mongoose!");
  } catch (error) {
    console.log(error.message);
  }
};
