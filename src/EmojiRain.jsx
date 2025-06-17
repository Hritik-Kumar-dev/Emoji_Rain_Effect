import React, { useEffect, useRef, useState } from 'react';
import './EmojiRain.css';

const emojis = ['🍕', '🍔', '🍟', '🌭', '🍩', '🍪', '🍿', '🍫',
  '🍜', '🍝', '🍣', '🍱', '🍛', '🥗', '🥪', '🥟',
  '🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🥝', '🥑',
  '🍰', '🧁', '🍦', '🍧', '🍨', '🍮',
  '☕', '🍵', '🧃', '🍺', '🥤', '🧋'];

const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const getRandomX = () => Math.random() * window.innerWidth;

const EmojiRain = () => {
  const [drops, setDrops] = useState([]);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate emojis
  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          emoji: getRandomEmoji(),
          x: getRandomX(),
          y: -30,
          speed: 1 + Math.random() * 2,
        },
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Move emojis down + apply hover disturbance
  useEffect(() => {
    const move = () => {
      setDrops((prev) =>
        prev
          .map((drop) => {
            const dx = mouseRef.current.x - drop.x;
            const dy = mouseRef.current.y - drop.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let offsetX = 0;
            if (dist < 80) {
              offsetX = dx > 0 ? -10 : 10;
            }

            return {
              ...drop,
              x: drop.x + offsetX,
              y: drop.y + drop.speed,
            };
          })
          .filter((drop) => drop.y < window.innerHeight + 50)
      );
      requestAnimationFrame(move);
    };
    move();
  }, []);

  return (
    <div className="emoji-rain-container" ref={containerRef}>
      {drops.map((drop) => (
        <span
          key={drop.id}
          className="emoji"
          style={{
            left: drop.x,
            top: drop.y,
            position: 'absolute',
          }}
        >
          {drop.emoji}
        </span>
      ))}
    </div>
  );
};

export default EmojiRain;
