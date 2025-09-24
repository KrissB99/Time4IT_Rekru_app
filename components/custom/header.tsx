import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header({
  name,
  date,
}: {
  name?: string;
  date?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="/img/avatar_photo.jpeg" alt="Olivia" />
        <AvatarFallback>OL</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Witaj ponownie, {name}
        </h1>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
}
