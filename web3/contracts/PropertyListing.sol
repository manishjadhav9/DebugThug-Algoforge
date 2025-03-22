pragma solidity ^0.8.0;

contract PropertyListing {
    struct Property {
        uint256 id;
        address owner;
        string description;
        uint256 pricePerDay;
        bool isAvailable;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    event PropertyAdded(uint256 indexed propertyId, address indexed owner);
    event PropertyUpdated(uint256 indexed propertyId);
    event PropertyDeleted(uint256 indexed propertyId);

    function addProperty(string memory _description, uint256 _pricePerDay) external {
        properties[propertyCount] = Property({
            id: propertyCount,
            owner: msg.sender,
            description: _description,
            pricePerDay: _pricePerDay,
            isAvailable: true
        });

        emit PropertyAdded(propertyCount, msg.sender);
        propertyCount++;
    }

    function updateProperty(uint256 _propertyId, string memory _description, uint256 _pricePerDay, bool _isAvailable) external {
        Property storage property = properties[_propertyId];
        require(property.owner == msg.sender, "Only the owner can update the property");

        property.description = _description;
        property.pricePerDay = _pricePerDay;
        property.isAvailable = _isAvailable;

        emit PropertyUpdated(_propertyId);
    }

    function deleteProperty(uint256 _propertyId) external {
        Property storage property = properties[_propertyId];
        require(property.owner == msg.sender, "Only the owner can delete the property");

        delete properties[_propertyId];

        emit PropertyDeleted(_propertyId);
    }

    function getProperty(uint256 _propertyId) external view returns (Property memory) {
        return properties[_propertyId];
    }
}
