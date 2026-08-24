import { FaBug, FaBolt, FaFileAlt } from "react-icons/fa";

const QUICK_ACTIONS = [
  {
    icon: FaFileAlt,
    label: "Escreva documentação",
    prompt: "Me ajude a escrever a documentação do meu projeto",
  },
  {
    icon: FaBolt,
    label: "Otimizar performance",
    prompt: "Me ajude a otimizar a performance do meu código",
  },
  {
    icon: FaFileAlt,
    label: "Procure e corrija 3 bugs",
    prompt: "Me ajude a encontar e corrigir bugs no meu código",
  },
];

const QuickActions = ({ onSelect }) => (
  <div className="text-center">
    <p className="text-zinc-400 text-sm mb-4">
      Tente esses exemplos para iniciar
    </p>
    <div className="flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
      {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }) => (
        <button
          key={label}
          onClick={() => onSelect(prompt)}
          className="group flex items-center justify-center gap-2 px-4 py2.5 bg-linear-to-r form-zinc-900/80 to-zinc-800/80 hover:from-zinc-800/80 hover:to-zinc-700/80 border border-zinc-700/50 hover:border-zinc-600/50 rounded-xl text-zinc-300 hover:text-zinc-200 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 sm:justify-start"
        >
          <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-center sm:text-left">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;
