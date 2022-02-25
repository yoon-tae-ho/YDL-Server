import Instructor from "./models/Instructor";
import Lecture from "./models/Lecture";
import Video from "./models/Video";
import Topic from "./models/Topic";

export const fakeData = async (req, res) => {
  const newDate = {
    title: "Theory of City Form",
    instructors: [
      "Prof. Mark Drela",
      "Prof. Steven Hall",
      "Prof. Paul A. Lagace",
      "Prof. Ingrid Kristina Lundqvist",
      "Prof. Gustaf Naeser",
      "Prof. Heidi Perry",
      "Prof. Raúl Radovitzky",
      "Prof. Ian A. Waitz",
      "Col. Peter Young",
      "Prof. Jennifer L. Craig",
    ],
    institute: "MIT",
    description:
      "This course covers theories about the form that settlements should take and attempts a distinction between descriptive and normative theory by examining examples of various theories of city form over time. Case studies will highlight the origins of the modern city and theories about its emerging form, including the transformation of the nineteenth-century city and its organization. Through examples and historical context, current issues of city form in relation to city-making, social structure, and physical design will also be discussed and analyzed.",
    topics: [
      "Architecture",
      "Architectural Design",
      "Urban Studies",
      "Sociology",
      "Community Development",
    ],
    courseId: "4.241J / 11.330J",
    asTaughtIn: "2013",
    level: "Graduate",
    thumbnailUrl:
      "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/4-241js13.jpg",
    videos: [
      {
        title: "Lec 1: Introduction",
        description:
          "This lecture covers the motivations for the course, an introduction of urban history, and the role of cities throughout human history. The professor gives a brief explanation of each topic that is to be covered in the course.",
        thumbnailUrl: "https://img.youtube.com/vi/k2_wuThLG6o/default.jpg",
        embededCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/k2_wuThLG6o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        player: "YouTube",
        videoLink:
          "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/video-lectures/lec-1-introduction",
      },
      {
        title: "Lec 2: Normative Theory I: The City as Supernatural",
        description:
          "This lecture focuses on the cosmic model of the city, and the city as a consciousness and expression of religion. Some examples discussed include Solomon's temple, Eliade's depiction of the archaic man, feng shui, Athens, and barays.",
        thumbnailUrl: "https://img.youtube.com/vi/rbTLRBdEcqA/default.jpg",
        embededCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/rbTLRBdEcqA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        player: "YouTube",
        videoLink:
          "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/video-lectures/lec-2-normative-theory-i-the-city-as-supernatural",
      },
      {
        title: "Lec 3: Normative Theory II: The City as Machine",
        description:
          "This lecture covers the machine model, characterized by visual economy, decentralization, and urbanizing at low costs. Comparisons are drawn between the cosmic model, with examples including colonial expansion in Greece, Roman cities, and French bastides.",
        thumbnailUrl: "https://img.youtube.com/vi/oBKDFgLoR9o/default.jpg",
        embededCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/oBKDFgLoR9o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        player: "YouTube",
        videoLink:
          "https://ocw.mit.edu/courses/architecture/4-241j-theory-of-city-form-spring-2013/video-lectures/lec-3-normative-theory-ii-the-city-as-machine",
      },
    ],
  };

  const {
    title,
    instructors,
    institute,
    description,
    topics,
    courseId,
    asTaughtIn,
    level,
    thumbnailUrl,
    videos,
  } = newDate;

  const createInstructors = async () => {
    const instructorIds = [];
    for (let i = 0; i < instructors.length; ++i) {
      const instructor = await Instructor.create({ name: instructors[i] });
      instructorIds.push(instructor._id);
    }
    return instructorIds;
  };

  const createTopics = async () => {
    const topicIds = [];
    for (let i = 0; i < topics.length; ++i) {
      let topic = await Topic.findOne({ name: topics[i] });
      if (!topic) {
        topic = await Topic.create({ name: topics[i] });
      }
      topicIds.push(topic._id);
    }
    return topicIds;
  };

  try {
    for (let j = 0; j < 40; ++j) {
      const [instructorIds, topicIds] = await Promise.all([
        createInstructors(),
        createTopics(),
      ]);

      const lecture = await Lecture.create({
        title,
        instructors: instructorIds,
        topics: topicIds,
        asTaughtIn,
        institute,
        level,
        courseId,
        description,
        thumbnailUrl,
      });

      videos.forEach(async (video, index) => {
        Video.create({
          belongIn: lecture._id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          embededCode: video.embededCode,
          videoLink: video.videoLink,
          player: video.player,
        });
      });
    }

    return res.send("Mongoose!");
  } catch (error) {
    console.log(error.message);
  }
};
