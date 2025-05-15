import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { casteCategories, tamilNaduDistricts } from "@/constants/data";
import { EligibilityFormData } from "@/types";

interface EligibilityFormProps {
  formData: EligibilityFormData;
  onInputChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

export function EligibilityForm({ formData, onInputChange, onSubmit }: EligibilityFormProps) {
  return (
    <form className="space-y-4">
      {/* Community Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Community</label>
        <Select
          onValueChange={(value) => onInputChange("caste", value)}
          value={formData.caste}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select community" />
          </SelectTrigger>
          <SelectContent>
            {casteCategories.map((caste) => (
              <SelectItem key={caste} value={caste}>{caste}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gender Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <Select
          onValueChange={(value) => onInputChange("gender", value)}
          value={formData.gender}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            {["Male", "Female", "Other"].map((gender) => (
              <SelectItem key={gender} value={gender.toLowerCase()}>{gender}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">District</label>
        <Select
          onValueChange={(value) => onInputChange("district", value)}
          value={formData.district}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {tamilNaduDistricts.map((district) => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Income Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Annual Family Income</label>
        <Input
          value={formData.income}
          onChange={(e) => onInputChange("income", e.target.value)}
          placeholder="Enter your family income"
          type="number"
        />
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        Check Eligibility
      </Button>
    </form>
  );
}
