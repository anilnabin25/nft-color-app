pragma solidity ^0.5.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ERC721Full.sol";

contract Color is ERC721Full {
  string[] public colors;
  mapping(string => bool) _colorExists;

  constructor() ERC721Full("Color", "COLOR") public {
  }

  // E.G. color = "#FFFFFF"
  function mint(string memory _color) public {
    require(!_colorExists[_color]);
    uint _id = colors.push(_color);
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
  }

}

//contract Color is ERC721Full {
//  string[] public colors;
//  mapping(string => bool) _colorExists;
//
//  constructor() ERC721Full("Color", "COLOR") public {
//  }
//
//  // Eg color = "#FFFFFF"
//  function mint(string memory _color) public {
//    // Require unique color
//    require(!_colorExists[_color]);
//    // color -  add it
//    uint _id = colors.push(_color);
//    // call the mint function
//    _mint(msg.sender, _id);
//    // color - tract it and add it
//    _colorExists[_color] = true;
//  }
//}
