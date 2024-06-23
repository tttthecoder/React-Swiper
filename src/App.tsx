import { useEffect, useRef, useState } from "react";
import "./App.css";
const items = [
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
  {
    imageSrc:
      "https://mdn.github.io/learning-area/javascript/building-blocks/gallery/images/pic4.jpg",
    imageAlt: "Lorem ipsum",
  },
  {
    imageSrc:
      "https://mdn.github.io/learning-area/javascript/building-blocks/gallery/images/pic5.jpg",
    imageAlt: "Lorem ipsum 2",
  },
];
function useSwiper<T extends HTMLElement, D extends HTMLElement>() {
  const [currentXoffsetOfCursor, setCurrentXoffsetOfCursor] = useState<
    number | null
  >(null);
  const [selected, setSelected] = useState<number>(0);
  const [freezedCursorToBorder, setFreezedCursorToBorder] = useState<
    number | null
  >(null);
  const [outerContainerToLeftViewPort, setOuterContainerToLeftViewPort] =
    useState<number | null>(null);

  const containerRef = useRef<T>(null);
  const outerContainterRef = useRef<D>(null);
  const lastTimeMouseDownRef = useRef<number>();
  const [monitoringState, setMonitoringState] = useState(false);
  useEffect(() => {
    setOuterContainerToLeftViewPort(
      outerContainterRef.current!.getBoundingClientRect().left
    );
    const handler = (e: globalThis.MouseEvent) => {
      setMonitoringState(true);
      lastTimeMouseDownRef.current = Date.now();
      const distanceFromCursorToborder =
        e.clientX - containerRef.current!.getBoundingClientRect().left;
      setFreezedCursorToBorder(distanceFromCursorToborder);
      setCurrentXoffsetOfCursor(e.clientX);
    };
    containerRef.current!.addEventListener("mousedown", handler);
    return () => {
      containerRef.current!.addEventListener("mousedown", handler);
    };
  }, []);
  useEffect(() => {
    if (!monitoringState) return;
    const eventMouseMove = (e: globalThis.MouseEvent) => {
      setCurrentXoffsetOfCursor(e.clientX);
      // find closest child item to the outer container midline
      const midlineOfContainer =
        outerContainterRef.current!.getBoundingClientRect().width / 2 +
        outerContainterRef.current!.getBoundingClientRect().left;
      var newSelected = 0;
      var minDistance = Math.abs(
        containerRef.current!.children[0].getBoundingClientRect().left +
          containerRef.current!.children[0].getBoundingClientRect().width / 2 -
          midlineOfContainer
      );
      // console.log("in window", e.target);
      // console.log(minDistance);
      for (let i = 1; i < containerRef.current!.children.length; i++) {
        const newDistance = Math.abs(
          containerRef.current!.children[i].getBoundingClientRect().left +
            containerRef.current!.children[i].getBoundingClientRect().width /
              2 -
            midlineOfContainer
        );
        // console.log(newDistance);
        if (newDistance < minDistance) {
          minDistance = newDistance;
          newSelected = i;
        }
      }
      // console.log(newSelected, "new");
      setSelected(newSelected);
    };
    const eventMouseUp = (e: globalThis.MouseEvent) => {
      setMonitoringState(false);
      setCurrentXoffsetOfCursor(null);
      setFreezedCursorToBorder(null);
      // find closest child item to the outer container midline
      const midlineOfContainer =
        outerContainterRef.current!.getBoundingClientRect().width / 2 +
        outerContainterRef.current!.getBoundingClientRect().left;
      var newSelected = 0;
      var minDistance = Math.abs(
        containerRef.current!.children[0].getBoundingClientRect().left +
          containerRef.current!.children[0].getBoundingClientRect().width / 2 -
          midlineOfContainer
      );
      // console.log("in window", e.target);
      // console.log(minDistance);
      for (let i = 1; i < containerRef.current!.children.length; i++) {
        const newDistance = Math.abs(
          containerRef.current!.children[i].getBoundingClientRect().left +
            containerRef.current!.children[i].getBoundingClientRect().width /
              2 -
            midlineOfContainer
        );
        // console.log(newDistance);
        if (newDistance < minDistance) {
          minDistance = newDistance;
          newSelected = i;
        }
      }
      // console.log(newSelected, "new");
      setSelected(newSelected);
    };
    window.addEventListener("mousemove", eventMouseMove);
    window.addEventListener("mouseup", eventMouseUp);
    return () => {
      window.removeEventListener("mousemove", eventMouseMove);
      window.removeEventListener("mouseup", eventMouseUp);
    };
  }, [monitoringState]);
  var transformStyle;
  if (containerRef.current) {
    const distanceTomove = !monitoringState
      ? (
          outerContainterRef.current!.getBoundingClientRect().width / 2 -
          (containerRef.current!.children[selected].getBoundingClientRect()
            .left -
            containerRef.current!.getBoundingClientRect().left) -
          containerRef.current!.children[selected].getBoundingClientRect()
            .width /
            2
        ).toString() + "px"
      : (
          currentXoffsetOfCursor! -
          freezedCursorToBorder! -
          outerContainerToLeftViewPort!
        ).toString() + "px";
    transformStyle = `translateX(${distanceTomove})`;
  } else {
    transformStyle = `translateX(${0}px)`;
  }
  const itemClickHandler = (index: number) => {
    if (Date.now() - lastTimeMouseDownRef.current! < 200) {
      setSelected(index);
    } else {
      console.log("cancel click");
    }
  };
  console.log(transformStyle);
  return {
    containerRef,
    outerContainterRef,
    transformStyle,
    selected,
    buttonClickHandler: (itemIndex: number) => setSelected(itemIndex),
    itemClickHandler,
  };
}
function App() {
  const {
    containerRef,
    outerContainterRef,
    transformStyle,
    itemClickHandler,
    buttonClickHandler,
    selected,
  } = useSwiper<HTMLUListElement, HTMLDivElement>();
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={outerContainterRef}
        className="w-[300px] mt-20 h-auto overflow-clip border-2 border-cyan-500"
      >
        <ul
          ref={containerRef}
          style={{
            transform: transformStyle,
          }}
          className="flex gap-2 justify-between"
        >
          {items.map((item, index) => {
            return (
              <li className={"relative"} key={item.imageAlt}>
                <img
                  draggable={false}
                  onClick={() => itemClickHandler(index)}
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className={` cursor-pointer transition-all duration-200 ${
                    selected === index ? "" : "blur-sm"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <ul className="flex mx-auto gap-4 cursor-pointer">
        {items.map((item, index) => {
          return (
            <li
              onClick={() => {
                buttonClickHandler(index);
              }}
              className={`h-4 w-4 rounded-full transition-all duration-300 ${
                index === selected ? "bg-cyan-600 scale-125" : "bg-cyan-300"
              }  `}
              key={item.imageAlt}
            ></li>
          );
        })}
      </ul>
    </div>
  );
}
export default App;
