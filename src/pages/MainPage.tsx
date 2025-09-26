import React, { useState, useEffect } from 'react';

interface FileTypes {
  name: string;
  type: string;
}

interface _projects {
  name: string;
  url: string;
  additional_url?: string;
}

const dirAndFiles: FileTypes[] = [
  { name: 'about.txt', type: 'file' },
  { name: 'projects', type: 'directory' },
  { name: 'experience.txt', type: 'file' },
];

const action_commands = ['cd', 'ls', 'clear', 'help', 'git'];

const projects_list: _projects[] = [
  { name: 'cookery-app', url: 'https://github.com/SouthKioto/cookery-app' },

  {
    name: 'ts-timetable-generator',
    url: 'https://github.com/SouthKioto/ts-timetable-generator',
    additional_url: 'youtube.com',
  },

  {
    name: 'flappy-bird-react-phaser',
    url: 'https://github.com/SouthKioto/flappy-bird-react-phaser',
  },
];

export const MainPage = () => {
  const [input, setInput] = useState<string[]>([]);

  const [history, setHistory] = useState<
    {
      type: 'input' | 'output';
      path?: string;
      text: string | React.ReactNode;
    }[]
  >([]);

  const [path, setPath] = useState<string[]>([]);
  const [pathString, setPathStringCopy] = useState<string>();

  const [inDirectory, setInDirectory] = useState(false);
  const [directory, setDirectory] = useState('');

  useEffect(() => {
    const fullPath = path.length > 0 ? `${path.join('/')}/ ` : '';
    setPathStringCopy(fullPath);
  }, [path]);

  const handleCheckPath = (path: string[]) => {
    const fullPath = path.length > 0 ? `${path.join('/')}/ ` : '';
    return <span>${fullPath} </span>;
  };

  const handleEnter = () => {
    const command = input.join('').trim();
    const [action, arg] = command.split(' ');
    let result = '';

    if (command === 'help') {
      result = `Available commands: ${action_commands.join(', ')}, and files/directories: ${dirAndFiles.map((f) => f.name).join(', ')}`;
    } else if (command === 'clear') {
      setHistory([]);
      setInput([]);
      return;
    } else if (action === 'git') {
      result = (
        <a
          href="https://github.com/SouthKioto"
          target="_blank"
          className="underline"
        >
          My Github account
        </a>
      );
    } else if (command === 'ls') {
      if (path.toString() === 'projects') {
        result = projects_list.map((project, index) => {
          return (
            <span key={index}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {project.name}
              </a>{' '}
            </span>
          );
        });
      } else {
        result = dirAndFiles
          .map((f) => (f.type === 'directory' ? `${f.name}/` : f.name))
          .join('  ');
      }
    } else if (action === 'cd') {
      console.log(path);
      console.log(history);
      if (arg === '..') {
        if (path.length > 0) {
          setPath((prev) => prev.slice(0, -1));
          //result = 'Powrót do katalogu nadrzędnego';
        } else {
          result = 'You are in main directory';
        }
      } else {
        const isDirectory = dirAndFiles.some(
          (dir) => dir.name === arg && dir.type === 'directory',
        );
        if (isDirectory) {
          setDirectory(arg);
          setPath((prev) => [...prev, arg]);
          setInDirectory(true);
          //result = `Przechodzisz do katalogu ${arg}/`;
        } else {
          result = `Cannot find directory: ${arg}`;
        }
      }
    } else if (
      dirAndFiles.some((f) => f.name === command && f.type === 'file')
    ) {
      switch (command) {
        case 'about':
          result = 'Hi, Im Bartek';
          break;
        case 'experience':
          result =
            'I worked as an IT specialist at the local council. So far, I have no experience working as a developer.';
          break;
        default:
          result = `File: ${command}`;
      }
    } else if (
      dirAndFiles.some((f) => f.name === command && f.type === 'directory')
    ) {
      result = `\`${command}\` is a directory. Use: cd ${command}`;
    } else {
      result = `Unknow command: "${command}"`;
    }

    setHistory((prev) => [
      ...prev,
      { type: 'input', path: pathString, text: command || '' },
      { type: 'output', text: result },
    ]);

    setInput([]);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      setInput((prev) => [...prev, event.key]);
    } else if (event.key === 'Backspace') {
      setInput((prev) => prev.slice(0, -1));
    } else if (event.key === 'Enter') {
      handleEnter();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  return (
    <>
      <div className="font-mono bg-black text-green-400 p-4 min-h-screen">
        <div>
          Type <i>help</i> to show commands
        </div>
        {history.map((line, index) => (
          <div key={index}>
            {line.type === 'input' ? (
              <span>
                $ {line.path}
                {line.text}
              </span>
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        ))}

        <div>
          {handleCheckPath(path)}
          {input.map((inputs, index) => (
            <span key={index}>{inputs}</span>
          ))}
          <span className="animate-pulse">█</span>
        </div>
      </div>
    </>
  );
};
