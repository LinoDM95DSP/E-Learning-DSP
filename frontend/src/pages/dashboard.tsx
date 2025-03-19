import LearningContentVideoLayout from "../components/layouts/learning_content_video";

const supplementaryContent = [
  {
    label: "Offizielle PowerpuffGirls Wikipedia Seite",
    url: "https://de.wikipedia.org/wiki/Powerpuff_Girls",
  },
  {
    label: "Ultimativer PoweruffGirls FanClub",
    url: "https://ppgfanon.fandom.com/wiki/Official_Powerpuff_Girls_Fan_Club",
  },
];

function Dashboard() {
  return (
    <div className="">
      <LearningContentVideoLayout
        videoUrl="https://www.youtube.com/embed/MVRmWIt6rfA"
        title="PowerpuffGirls Storys"
        description="Dieses Video bietet eine grundlegende Einführung in die Geschichte von PowerpuffGirls Dieses Video bietet eine grundlegende Einführung in die Geschichte von PowerpuffGirlsDieses Video bietet eine grundlegende Einführung in die Geschichte von PowerpuffGirlsDieses Video bietet eine grundlegende Einführung in die Geschichte von PowerpuffGirlsDieses Video bietet eine grundlegende Einführung in die Geschichte von PowerpuffGirlsDieses Video bietet eine grundlegende Einführung in die Geschichte vonEinführung in die Geschichte von PowerpuffGirlsDieses Video bietet eine grundlegende Einführung in die Geschichte von PowerpuffGirlsDieses Video bietet eine grundlegende "
        supplementaryContent={supplementaryContent}
      />
    </div>
  );
}

export default Dashboard;
