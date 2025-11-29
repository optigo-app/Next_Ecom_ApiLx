import { storImagePath } from "./../../../../utils/Glob_Functions/GlobalFunction";

export const ReactStoriesConfig = {
  storyInnerContainerStyles: {
    backgroundColor: "#fff",
    filter:'none'
  },
  progressWrapperStyles: {
    height: "3px",
    borderRadius: "15px",
    backgroundColor: "#8f8f8f69",
    boxShadow: "none", // Remove any shadow
    filter:'none'
  },
  progressStyles: {
    height: "3px",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
    boxShadow: "none", // Remove any shadow
    filter:'none'
  },
  defaultInterval: 1600,
  width: "100%",
  height: "100%",
  loop: true,
};

export const ProductListConfig = [
  {
    designNo: "ANB9",
    images: [
      "https://images.pexels.com/photos/27155546/pexels-photo-27155546/free-photo-of-portrait-of-smiling-woman-in-traditional-clothing.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/4584572/pexels-photo-4584572.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/12737595/pexels-photo-12737595.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/19401523/pexels-photo-19401523/free-photo-of-luxury-eastern-dresses-2024-shoot-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/12737606/pexels-photo-12737606.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    designNo: "ANB8",
    images: [
      "https://images.pexels.com/photos/27155546/pexels-photo-27155546/free-photo-of-portrait-of-smiling-woman-in-traditional-clothing.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    designNo: "ANB7",
    images: [
      "https://images.pexels.com/photos/27155546/pexels-photo-27155546/free-photo-of-portrait-of-smiling-woman-in-traditional-clothing.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    designNo: "ANB6",
    images: [
      "https://images.pexels.com/photos/27155546/pexels-photo-27155546/free-photo-of-portrait-of-smiling-woman-in-traditional-clothing.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
];

export const ProductListConfig2 = [
  // test
  {
    designNo: "ANB9",
    images: [
      `${storImagePath() + "/statusbar/swr10/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr10/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr10/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr10/sw4.jpg"}`,
    ],
    videos: [
      `https://videos.pexels.com/video-files/27989388/12282745_1080_1920_30fps.mp4`,
      `https://videos.pexels.com/video-files/11057646/11057646-hd_1080_1920_30fps.mp4`,
    ],
  },
  {
    designNo: "ANB8",
    images: [
      `${storImagePath() + "/statusbar/swr11/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr11/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr11/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr11/sw4.jpg"}`,
    ],
    videos: [
      `https://videos.pexels.com/video-files/27989388/12282745_1080_1920_30fps.mp4`,
      `https://videos.pexels.com/video-files/9430541/9430541-uhd_1440_2732_25fps.mp4`,
    ],
  },
  {
    designNo: "ANB7",
    images: [
      `${storImagePath() + "/statusbar/swr12/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr12/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr12/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr12/sw4.jpg"}`,
    ],
    videos: [
      `https://videos.pexels.com/video-files/9430541/9430541-uhd_1440_2732_25fps.mp4`,
      `https://videos.pexels.com/video-files/11057646/11057646-hd_1080_1920_30fps.mp4`,
    ],
  },
  {
    designNo: "ANB6",
    images: [
      `${storImagePath() + "/statusbar/swr13/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr13/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr13/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr13/sw4.jpg"}`,
    ],
    videos: [
      `https://videos.pexels.com/video-files/11057646/11057646-hd_1080_1920_30fps.mp4`,
    ],
  },
  // original
  {
    designNo: "SWR-10",
    images: [
      `${storImagePath() + "/statusbar/swr10/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr10/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr10/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr10/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-11",
    images: [
      `${storImagePath() + "/statusbar/swr11/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr11/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr11/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr11/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-12",
    images: [
      `${storImagePath() + "/statusbar/swr12/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr12/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr12/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr12/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-13",
    images: [
      `${storImagePath() + "/statusbar/swr13/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr13/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr13/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr13/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-14",
    images: [
      `${storImagePath() + "/statusbar/swr14/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr14/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr14/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr14/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-15",
    images: [
      `${storImagePath() + "/statusbar/swr15/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr15/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr15/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr15/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-44",
    images: [
      `${storImagePath() + "/statusbar/swr44/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr44/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr44/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr44/sw4.jpg"}`,
    ],
  },
  {
    designNo: "SWR-45",
    images: [
      `${storImagePath() + "/statusbar/swr45/sw2.jpg"}`,
      `${storImagePath() + "/statusbar/swr45/sw1.jpg"}`,
      `${storImagePath() + "/statusbar/swr45/sw3.jpg"}`,
      `${storImagePath() + "/statusbar/swr45/sw4.jpg"}`,
    ],
  },
];
