import { LegacyRef, useEffect, useRef, useState } from "react";
import "./App.css";
const items = [
  {
    imageSrc:
      "https://mdn.github.io/learning-area/javascript/building-blocks/gallery/images/pic2.jpg",
    imageAlt: "A person's eye",
  },
  {
    imageSrc:
      "https://mdn.github.io/learning-area/javascript/building-blocks/gallery/images/pic2.jpg",
    imageAlt: "A rock formation",
  },
  {
    imageSrc:
      "https://mdn.github.io/learning-area/javascript/building-blocks/gallery/images/pic3.jpg",
    imageAlt: "Some flowers",
  },
];

function App() {
  const [currentXoffset, setCurrentXoffset] = useState(0);
  const [monitoringState, setMonitoringState] = useState<{
    distanceFromBorderToMouse: null | number;
    distanceFromLeftViewportToOuterContainer: null | number;
    isMonitor: boolean;
  }>({
    distanceFromBorderToMouse: null,
    isMonitor: false,
    distanceFromLeftViewportToOuterContainer: null,
  });
  const innerContainerRef = useRef<HTMLUListElement>(null);
  const outerContainterRef = useRef<HTMLDivElement>(null);
  var distanceTomove;
  if (monitoringState.isMonitor) {
    distanceTomove =
      currentXoffset -
      monitoringState.distanceFromBorderToMouse! -
      monitoringState.distanceFromLeftViewportToOuterContainer!;
  }

  useEffect(() => {
    if (!monitoringState.isMonitor) return;
    const eventMouseMove = (e: MouseEvent) => {
      setCurrentXoffset(e.clientX);
    };
    const eventMouseUp = (e: MouseEvent) => {
      setMonitoringState({
        isMonitor: false,
        distanceFromBorderToMouse: null,
        distanceFromLeftViewportToOuterContainer: null,
      });

      setCurrentXoffset(e.clientX);
    };
    window.addEventListener("mousemove", eventMouseMove);
    window.addEventListener("mouseup", eventMouseUp);
    return () => {
      window.removeEventListener("mousemove", eventMouseMove);
      window.removeEventListener("mouseup", eventMouseUp);
    };
  }, [monitoringState.isMonitor]);
  return (
    <div
      ref={outerContainterRef}
      className=" bg-blue-500 w-[500px] mt-20 h-32 ml-[160px] overflow-clip"
    >
      <ul
        onMouseDown={(e) => {
          setCurrentXoffset(e.clientX);
          const distanceToCursor =
            e.clientX - innerContainerRef.current!.getBoundingClientRect().left;
          const outerContainterRefToViewport =
            outerContainterRef.current!.getBoundingClientRect().left;
          setMonitoringState({
            isMonitor: true,
            distanceFromLeftViewportToOuterContainer:
              outerContainterRefToViewport,
            distanceFromBorderToMouse: distanceToCursor,
          });
        }}
        style={{
          transform: `translateX(${distanceTomove ? distanceTomove : ""}px)`,
        }}
        ref={innerContainerRef}
        className="flex bg-red-400"
      >
        <br />
        {items.map((item) => {
          return (
            <li className={"relative"}>
              <img
                draggable={false}
                src={item.imageSrc}
                alt={item.imageAlt}
                className="swiper-img"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
