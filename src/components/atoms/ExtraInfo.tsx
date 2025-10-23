import contactData, { type ContactItem } from '../../constant/data';

const ExtraInfo = () => {
  if (!contactData?.extraInfo) return null;

  return (
    <div className="flex flex-row items-center justify-center gap-4 p-2">
      {contactData.extraInfo.map((item: ContactItem, index: number) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
          className="flex items-center text-secundary gap-2"
        >
          {item.icon && <item.icon className="w-6 h-6" />}
          <span className="hidden md:inline">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export default ExtraInfo;
