import React from 'react';
import { Card, Form } from 'react-bootstrap';

function FilterComponent({ 
  sortBy, 
  onSortChange, 
  selectedType, 
  onTypeChange, 
  types,
  title = "Filters" 
}) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">{title}</h5>
        
        {/* Sort by Price */}
        <Form.Group className="mb-4">
          <Form.Label><strong>Sort by Price</strong></Form.Label>
          <Form.Select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">No sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Form.Select>
        </Form.Group>

        {/* Filter by Type */}
        <Form.Group className="mb-4">
          <Form.Label><strong>Hotel Type</strong></Form.Label>
          <Form.Select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">All Types</option>
            {Array.from(types).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default FilterComponent;