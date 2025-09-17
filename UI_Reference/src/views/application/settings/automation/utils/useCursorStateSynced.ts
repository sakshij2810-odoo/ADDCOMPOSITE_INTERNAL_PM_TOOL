import { useCallback, useEffect, useMemo, useState } from 'react';
import { useReactFlow } from 'reactflow';
import ydoc from './ydoc';
import { stringToColor } from './utils';

const cursorsMap = ydoc.getMap<Cursor>('cursors');
const cursorId = ydoc.clientID.toString();
const cursorColor = stringToColor(cursorId);

const MAX_IDLE_TIME = 10000;

export type Cursor = {
  id: string;
  color: string;
  x: number;
  y: number;
  timestamp: number;
};

export function useCursorStateSynced() {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  // Flush any cursors that have gone stale.
  const flush = useCallback(() => {
    const now = Date.now();
    //@ts-ignore
    for (const [id, cursor] of cursorsMap) {
      if (now - cursor.timestamp > MAX_IDLE_TIME) {
        cursorsMap.delete(id);
      }
    }
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      cursorsMap.set(cursorId, {
        id: cursorId,
        color: cursorColor,
        x: position.x,
        y: position.y,
        timestamp: Date.now(),
      });
    },
    [screenToFlowPosition]
  );

  useEffect(() => {
    const timer = window.setInterval(flush, MAX_IDLE_TIME);
    const observer = () => {
      //@ts-ignore
      setCursors([...cursorsMap.values()]);
    };

    flush();
    //@ts-ignore
    setCursors([...cursorsMap.values()]);
    cursorsMap.observe(observer);

    return () => {
      cursorsMap.unobserve(observer);
      window.clearInterval(timer);
    };
  }, [flush]);

  const cursorsWithoutSelf = useMemo(() => cursors.filter(({ id }) => id !== cursorId), [cursors]);

  return [cursorsWithoutSelf, onMouseMove] as const;
}

export default useCursorStateSynced;
