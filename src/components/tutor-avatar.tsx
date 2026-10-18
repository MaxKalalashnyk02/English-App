import { PaintedDrawing } from '@/components/painted-drawing';
import { AVATAR_VIEWBOX, AVATARS } from '@/constants/avatars';
import type { Tutor } from '@/constants/tutors';

type TutorAvatarProps = {
  tutor: Tutor;
  size: number;
  delay?: number;
};

export function TutorAvatar({ tutor, size, delay }: TutorAvatarProps) {
  return (
    <PaintedDrawing
      data={AVATARS[tutor.id]}
      id={tutor.id}
      viewBoxSize={AVATAR_VIEWBOX}
      size={size}
      delay={delay}
    />
  );
}
