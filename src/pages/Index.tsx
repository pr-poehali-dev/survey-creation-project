import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  city: string;
  age: string;
  workHours: string;
  hasCard: string;
  gender: string;
  name: string;
}

const Index = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    city: '',
    age: '',
    workHours: '',
    hasCard: '',
    gender: '',
    name: ''
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    const currentField = getCurrentField();
    if (!formData[currentField as keyof FormData]) {
      toast({
        title: 'Заполните поле',
        description: 'Пожалуйста, ответьте на вопрос перед продолжением',
        variant: 'destructive'
      });
      return;
    }

    if (step < totalSteps) {
      setDirection('forward');
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('backward');
      setStep(step - 1);
    }
  };

  const getCurrentField = () => {
    const fields = ['city', 'age', 'workHours', 'hasCard', 'gender', 'name'];
    return fields[step - 1];
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/acc04cee-a4e8-408d-968c-b5fce36dcab2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Icon name="Check" size={40} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Спасибо за ваши ответы!
            </h1>
            <div className="text-lg md:text-xl text-gray-700 space-y-3 mb-8">
              <p>Ваши данные успешно отправлены.</p>
              <p className="font-semibold">Вот мой телеграмм: <a href="https://t.me/telecommute1" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-pink-600 transition-colors">@telecommute1</a></p>
              <p>Пишите мне для получения Сертификата</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
          >
            Начать заново
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 relative">
      <button
        onClick={() => setShowAdmin(true)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Админка"
      >
        <Icon name="Settings" size={24} className="text-white" />
      </button>

      <Card className="w-full max-w-2xl p-8 md:p-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Опрос
            </h2>
            <span className="text-sm font-semibold text-gray-600">
              {step} из {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
        </div>

        <div className={`space-y-6 ${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`} key={step}>
          {step === 1 && (
            <div className="space-y-4">
              <Label htmlFor="city" className="text-lg font-semibold">
                <Icon name="MapPin" size={24} className="inline mr-2 text-purple-600" />
                Ваш город
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder="Введите название города"
                className="text-lg p-6"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label htmlFor="age" className="text-lg font-semibold">
                <Icon name="Calendar" size={24} className="inline mr-2 text-purple-600" />
                Ваш возраст
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateFormData('age', e.target.value)}
                placeholder="Введите ваш возраст"
                className="text-lg p-6"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label htmlFor="workHours" className="text-lg font-semibold">
                <Icon name="Clock" size={24} className="inline mr-2 text-purple-600" />
                Сколько сможете работать в день?
              </Label>
              <Input
                id="workHours"
                value={formData.workHours}
                onChange={(e) => updateFormData('workHours', e.target.value)}
                placeholder="Например: 4 часа, весь день"
                className="text-lg p-6"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <Icon name="CreditCard" size={24} className="inline mr-2 text-purple-600" />
                Есть ли у вас банковская карта?
              </Label>
              <RadioGroup value={formData.hasCard} onValueChange={(value) => updateFormData('hasCard', value)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="yes" id="card-yes" />
                  <Label htmlFor="card-yes" className="text-lg cursor-pointer flex-1">Да</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="no" id="card-no" />
                  <Label htmlFor="card-no" className="text-lg cursor-pointer flex-1">Нет</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                <Icon name="User" size={24} className="inline mr-2 text-purple-600" />
                Ваш пол
              </Label>
              <RadioGroup value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male" className="text-lg cursor-pointer flex-1">Мужской</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female" className="text-lg cursor-pointer flex-1">Женский</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <Label htmlFor="name" className="text-lg font-semibold">
                <Icon name="UserCircle" size={24} className="inline mr-2 text-purple-600" />
                Ваше имя
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Введите ваше имя"
                className="text-lg p-6"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 text-lg py-6"
            >
              <Icon name="ChevronLeft" size={20} className="mr-2" />
              Назад
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6"
          >
            {step === totalSteps ? 'Отправить' : 'Далее'}
            {step < totalSteps && <Icon name="ChevronRight" size={20} className="ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/49497aaf-1a3d-488c-af94-b5a811bb1956', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadResponses();
      } else {
        toast({
          title: 'Неверный пароль',
          description: 'Попробуйте еще раз',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const loadResponses = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/8a4d4559-77b0-4f54-833f-cc0fbcea67a7', {
        headers: { 'X-Admin-Password': password }
      });
      if (response.ok) {
        const data = await response.json();
        setResponses(data.responses || []);
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
        <Card className="w-full max-w-md p-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">Вход в админку</h2>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="p-6"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
            >
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </button>
            <h1 className="text-2xl font-bold">Результаты опроса</h1>
            <span className="text-gray-600">Всего: {responses.length}</span>
          </div>
        </Card>

        <div className="grid gap-4">
          {responses.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              Пока нет ответов
            </Card>
          ) : (
            responses.map((response, idx) => (
              <Card key={idx} className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Имя:</span>
                    <p className="font-semibold">{response.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Город:</span>
                    <p className="font-semibold">{response.city}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Возраст:</span>
                    <p className="font-semibold">{response.age}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Часов работы:</span>
                    <p className="font-semibold">{response.workHours}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Банковская карта:</span>
                    <p className="font-semibold">{response.hasCard === 'yes' ? 'Да' : 'Нет'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Пол:</span>
                    <p className="font-semibold">{response.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                  </div>
                </div>
                {response.created_at && (
                  <div className="mt-4 text-sm text-gray-500">
                    Дата: {new Date(response.created_at).toLocaleString('ru-RU')}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;