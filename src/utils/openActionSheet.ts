import { Platform, ActionSheetIOS, ActionSheetIOSOptions } from 'react-native';
import DialogAndroid from 'react-native-dialogs';

interface IOpenActionSheetOption {
  key: string;
  value: string;
}

interface IOpenActionSheetConfig {
  title?: string;
  message?: string;
  tintColor?: string;
  selectedId?: string;
  selectedIds?: string[];
  destructiveButtonIndex?: number;
  options: any[];
  type?: 'plain' | 'radio' | 'checkbox';
  clear?: boolean;
  cancel?: boolean;
  onSelect?(option: string | IOpenActionSheetOption, index: number): void;
  onMultiSelect?(selected: any): void;
  onCancel?(): void;
}

function getOptionValue(option: any) {
  if (option instanceof Array && option.length === 2) {
    return option[1];
  }

  if (typeof option === 'object' && option.value) {
    return option.value;
  }

  return option;
}

function getOptionKey(option: any, index: number) {
  if (option instanceof Array && option.length === 2) {
    return option[0];
  }

  if (typeof option === 'object' && option.key) {
    return option.key;
  }

  return `item-${index}`;
}

export function openActionSheet(config: IOpenActionSheetConfig) {

  if (Platform.OS === 'ios') {
    const opts = {} as ActionSheetIOSOptions;

    // Map values
    opts.options = config.options.map(getOptionValue);

    if (config.cancel === true) {
      opts.cancelButtonIndex = opts.options.length;
      opts.options.push('Cancel');
    }

    opts.title = config.title;
    opts.message = config.message;
    opts.tintColor = config.tintColor;
    opts.destructiveButtonIndex = config.destructiveButtonIndex;

    ActionSheetIOS.showActionSheetWithOptions(
      opts,
      (index: number) => {
        if (opts.options.length === index && typeof config.onCancel === 'function') {
          return config.onCancel();
        }
        if (typeof config.onSelect === 'function') {
          return config.onSelect(config.options[index], index);
        }
      },
    );
  }

  if (Platform.OS === 'android') {

    // Convert options to { id, label }
    const items = config.options.map((option: any, index) => ({
      id: getOptionKey(option, index),
      label: getOptionValue(option),
    }));

    let type = DialogAndroid.listPlain;
    if (config.type === 'radio') {
      type = DialogAndroid.listRadio;
    }
    if (config.type === 'checkbox') {
      type = DialogAndroid.listCheckbox;
    }

    DialogAndroid.showPicker(config.title, config.message, {
      type,
      items,
      neutralIsClear: config.clear ? true : false,
      neutralText: config.clear ? 'Clear' : undefined,
      negativeText: config.cancel ? 'Cancel' : undefined,
      selectedId: config.selectedId,
      selectedIds: config.selectedIds,
    })
    .then(({ selectedItem, selectedItems }: any) => {
      if (selectedItem) {
        const index = items.findIndex(option => option.id === selectedItem.id);
        if (typeof config.onSelect === 'function') {
          return config.onSelect(config.options[index], index);
        }
      } else if (selectedItems) {
        if (typeof config.onMultiSelect === 'function') {
          return config.onMultiSelect(selectedItems);
        }
      } else if (typeof config.onCancel === 'function') {
        return config.onCancel();
      }
    });
  }
}
