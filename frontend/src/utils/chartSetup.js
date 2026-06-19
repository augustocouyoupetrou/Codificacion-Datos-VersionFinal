import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// El registro debe hacerse una sola vez en toda la aplicación.
// Este módulo se importa (por su efecto secundario) desde los
// componentes que renderizan gráficos de Chart.js.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default ChartJS;
