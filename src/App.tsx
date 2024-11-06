import { useState } from 'react';
import { Calculator, Mail, Scale, Target } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

type FormData = {
  name: string;
  email: string;
  age: string;
  gender: 'male' | 'female';
  weight: string;
  height: string;
  activityLevel: string;
  goal: 'lose' | 'maintain' | 'gain';
};

const activityLevels = {
  sedentary: 'Sedentário',
  light: 'Levemente ativo',
  moderate: 'Moderadamente ativo',
  active: 'Muito ativo',
  extra: 'Extremamente ativo'
};

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9
};

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'maintain'
  });

  const [finalCalories, setFinalCalories] = useState<number | null>(null);

  const calculateBMR = async (e: React.FormEvent) => {
    e.preventDefault();

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    let bmr;
    if (formData.gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];
    let tdee = bmr * activityMultiplier;

    switch (formData.goal) {
      case 'lose':
        tdee -= 500;
        break;
      case 'gain':
        tdee += 500;
        break;
    }

    setFinalCalories(tdee);

    try {
      await emailjs.send(
        'service_d6rtajl',
        'template_e0l08ak',
        {
          to_email: 'contato@nuwise.com.br',
          from_name: formData.name,
          user_email: formData.email,
          message: `
            Nome: ${formData.name}
            Email: ${formData.email}
            Idade: ${formData.age}
            Gênero: ${formData.gender === 'male' ? 'Masculino' : 'Feminino'}
            Peso: ${formData.weight}kg
            Altura: ${formData.height}cm
            Nível de Atividade: ${activityLevels[formData.activityLevel as keyof typeof activityLevels]}
            Objetivo: ${formData.goal === 'lose' ? 'Perder peso' : formData.goal === 'gain' ? 'Ganhar peso' : 'Manter peso'}
            Calorias Recomendadas: ${Math.round(tdee)} kcal/dia
          `
        }
      );
      toast.success('Resultado enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar o resultado. Tente novamente.');
      console.error('Email error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-center mb-8">
            <Calculator className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Calculadora Metabólica
          </h2>

          <form onSubmit={calculateBMR} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Idade
                </label>
                <input
                  type="number"
                  id="age"
                  required
                  min="15"
                  max="120"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gênero
                </label>
                <select
                  id="gender"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  required
                  min="120"
                  max="250"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                Nível de Atividade
              </label>
              <select
                id="activityLevel"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              >
                {Object.entries(activityLevels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                Objetivo
              </label>
              <select
                id="goal"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as 'lose' | 'maintain' | 'gain' })}
              >
                <option value="lose">Perder Peso</option>
                <option value="maintain">Manter Peso</option>
                <option value="gain">Ganhar Peso</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calcular
            </button>
          </form>

          {finalCalories && (
            <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-900 mb-2">Seu Resultado</h3>
              <p className="text-indigo-700">
                Você deve consumir aproximadamente{' '}
                <span className="font-bold">{Math.round(finalCalories)} kcal</span> por dia
                para {formData.goal === 'lose' ? 'perder' : formData.goal === 'gain' ? 'ganhar' : 'manter'} peso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}