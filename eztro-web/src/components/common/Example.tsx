import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Badge,
  Modal,
  ModalFooter,
  Loading,
  Alert,
  Dropdown,
  Textarea,
} from './index';

export const ComponentsExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const dropdownOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Disabled Option', value: '4', disabled: true },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Shared Components Demo</h1>

      {/* Buttons */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Buttons</h2>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardBody>
      </Card>

      {/* Inputs */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Inputs</h2>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Input label="Email" type="email" placeholder="Enter your email" fullWidth />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error="Password is required"
              fullWidth
            />
            <Input
              label="Search"
              placeholder="Search..."
              helperText="Type to search"
              fullWidth
            />
          </div>
        </CardBody>
      </Card>

      {/* Dropdown */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Dropdown</h2>
        </CardHeader>
        <CardBody>
          <Dropdown
            label="Select an option"
            options={dropdownOptions}
            value={selectedValue}
            onChange={(value) => setSelectedValue(value.toString())}
            fullWidth
          />
          <p style={{ marginTop: '10px' }}>Selected: {selectedValue || 'None'}</p>
        </CardBody>
      </Card>

      {/* Textarea */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Textarea</h2>
        </CardHeader>
        <CardBody>
          <Textarea
            label="Description"
            placeholder="Enter description..."
            helperText="Maximum 500 characters"
            fullWidth
          />
        </CardBody>
      </Card>

      {/* Badges */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Badges</h2>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge size="sm">Small</Badge>
            <Badge size="lg">Large</Badge>
            <Badge rounded>Rounded</Badge>
          </div>
        </CardBody>
      </Card>

      {/* Alerts */}
      {showAlert && (
        <Alert variant="info" onClose={() => setShowAlert(false)}>
          This is an informational alert. You can close it by clicking the X button.
        </Alert>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
        <Alert variant="success">Operation completed successfully!</Alert>
        <Alert variant="warning">Warning: Please check your input.</Alert>
        <Alert variant="error">Error: Something went wrong.</Alert>
      </div>

      {/* Modal */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Modal</h2>
        </CardHeader>
        <CardBody>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        </CardBody>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
      >
        <p>This is a modal dialog. You can put any content here.</p>
        <Input label="Name" placeholder="Enter your name" fullWidth />
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
        </ModalFooter>
      </Modal>

      {/* Loading */}
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <h2>Loading</h2>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Loading size="sm" />
            <Loading size="md" />
            <Loading size="lg" />
            <Loading text="Loading..." />
          </div>
        </CardBody>
      </Card>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <Card hoverable>
          <CardHeader>
            <h3>Hoverable Card</h3>
          </CardHeader>
          <CardBody>
            <p>Hover over this card to see the effect.</p>
          </CardBody>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>

        <Card shadow="xl">
          <CardHeader>
            <h3>Card with XL Shadow</h3>
          </CardHeader>
          <CardBody>
            <p>This card has an extra large shadow.</p>
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <h3>Large Padding</h3>
          </CardHeader>
          <CardBody>
            <p>This card has large padding.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
