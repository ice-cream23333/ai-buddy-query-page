
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiProvider, ApiProviderOption } from '@/types/chat';

interface ApiProviderSelectorProps {
  selectedProvider: ApiProvider;
  onProviderChange: (provider: ApiProvider) => void;
}

const providers: ApiProviderOption[] = [
  { id: 'doubao', name: 'Doubao' },
  { id: 'openai', name: 'OpenAI GPT' },
  { id: 'deepseek', name: 'DeepSeek' },
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
          <SelectValue placeholder="Select AI Provider" />
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
