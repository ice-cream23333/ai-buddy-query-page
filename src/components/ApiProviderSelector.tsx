
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiProvider, ApiProviderOption } from '@/types/chat';

interface ApiProviderSelectorProps {
  selectedProvider: ApiProvider;
  onProviderChange: (provider: ApiProvider) => void;
}

const providers: ApiProviderOption[] = [
  { id: 'mock', name: '模拟API' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'doubao', name: '豆包AI' },
];

const ApiProviderSelector: React.FC<ApiProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange
}) => {
  return (
    <div className="mb-2">
      <Select
        value={selectedProvider}
        onValueChange={(value) => onProviderChange(value as ApiProvider)}
      >
        <SelectTrigger className="w-full bg-white border-ai-purple">
          <SelectValue placeholder="选择AI提供者" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ApiProviderSelector;
