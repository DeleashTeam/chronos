import { Dropdown, Label } from 'flowbite-react';

function TypeAndColor({
  formState, onFormChange, types, colors,
}) {
  return (
    <div className="flex flex-row w-full justify-between items-center gap-2">
      <div>
        <Label>Event Type</Label>
        <Dropdown
          placement="right"
          label={
            <span className="w-32">
              {formState.type.charAt(0).toUpperCase() + formState.type.slice(1)}
            </span>
          }
        >
          {types.map((type, index) => (
            <Dropdown.Item
              name="type"
              onClick={() => {
                onFormChange('executor', null);
                onFormChange('type', type);
              }}
              key={index}
            >
              {type}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div>
        <Label>Event Color</Label>
        <Dropdown
          placement="right"
          style={{ backgroundColor: formState.color }}
          arrowIcon={false}
          className="w-32"
          label={<span className="w-5 h-5"></span>}
        >
          <Dropdown.Item>
            <div className="flex flex-col space-y-4 justify-between">
              {colors.map((color) => (
                <span
                  onClick={() => {
                    onFormChange('color', color);
                  }}
                  key={color}
                  style={{ backgroundColor: color }}
                  className="w-10 h-10 hover:border-2 hover:shadow-inner transition-none border-gray-900 -m-1 p-2 rounded-lg"
                >
                  {' '}
                </span>
              ))}
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
}

export default TypeAndColor;
