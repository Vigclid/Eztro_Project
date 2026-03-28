import { GenericService } from "../../core/services/base.service";
import settingModel, { DEFAULT_SETTING_VALUES, ISetting } from "./settings.model";

export class SettingService extends GenericService<ISetting> {
  constructor() {
    super(settingModel);
  }

  getByUserId = (userId: string) => {
    return settingModel.findOne({ userId }).exec();
  };

  createDefault = (userId: string) => {
    return settingModel.create({ userId, ...DEFAULT_SETTING_VALUES });
  };

  updateByUserId = (userId: string, data: Partial<ISetting>) => {
    const { inApp, notifyEmail, notifyZalo, theme } = data;
    return settingModel
      .findOneAndUpdate({ userId }, { inApp, notifyEmail, notifyZalo, theme }, { new: true })
      .exec();
  };

}
