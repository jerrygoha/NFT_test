pragma solidity 0.5.16;

import "./ERC721.sol";
import "./ERC165.sol";
import "./SafeMath.sol";
import "./Address.sol";

contract DeedToken is ERC721, ERC165 {

    using SafeMath for uint256;
    using Address for address;

    address payable public owner;
    //상태변수
    //erc165관련
    mapping(bytes4 => bool) supportedInterfaces;
    //토큰 소유자 정보
    mapping(uint256 => address) tokenOwners;
    //특정 계정이 갖고있는 토큰의 수(종류)
    mapping(address => uint256) balances;
    //어떤 계정이 어떤 승인 정보를 갖고있는지
    mapping(uint256 => address) allowance;
    //다수에게 자신이 가진 토큰을 관리할 수 있도록. bool 타입으로. _ 앞의 add는 토큰의 소유자, 뒤의 add는 중개인
    mapping(address => mapping(address => bool)) operators;

    //이모티콘의 얼굴, 눈, 입모양을 담는 구조체
    struct asset {
        uint8 x;    //얼굴
        uint8 y;    //눈
        uint8 z;    //입
   }

    //얼굴, 눈 입모양이 담긴 구조체들로 이루어진 배열
    asset[] public allTokens;

    //for enumeration
    //유효한 토큰 id만 갖고있는 배열
    uint256[] public allValidTokenIds; //same as allTokens but does't have invalid tokens
    //토큰 id를 갖고 index를 구할 수 있는것. (앞의 uint = 토큰 id, 뒤의 uint = index)
    mapping(uint256 => uint256) private allValidTokenIndex;


    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    /*
    *  생성자
    * ERC-165 identifier for this interface is 0x80ac58cd.
    */
    constructor() public {
        owner = msg.sender;

        supportedInterfaces[0x01ffc9a7] = true; //ERC165
        supportedInterfaces[0x80ac58cd] = true; //ERC721
    }

    /**
    *
    */
    function supportsInterface(bytes4 interfaceID) external view returns (bool){
        return supportedInterfaces[interfaceID];
    }

    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0));
        return balances[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {

        address addr_owner = tokenOwners[_tokenId];
        //소유자 계정이 0(null) 이라면 예외 발생.
        require(addr_owner != address(0), "Token is invalid");
        return addr_owner;
    }

    /**
    *  토큰 전송
    */
    function transferFrom(address _from, address _to, uint256 _tokenId) public payable {

        //토큰의 소유계정
        address addr_owner = ownerOf(_tokenId);

        //인자로 받는 _from이 토큰의 소유 계정과 일치하지 않으면 예외 발생.
        require(addr_owner == _from, "_from is NOT the owner of the token");
        //인자로 받는 _to가 0(null)이라면 예외 발생.
        require(_to != address(0), "Transfer _to address 0x0");

        //해당 토큰의 allowance address 여부 저장
        address addr_allowed = allowance[_tokenId];
        //토큰의 본 소유계정이 메소드를 호출한 사람에게 소유권을 이전할 수 있도록 승인을 했는지 여부 저장
        bool isOp = operators[addr_owner][msg.sender];

        //msg.sender가 토큰의 소유계정이거나, 토큰의 allowance에 있는 계정이거나, 중개인 계정 true인 경우가 아니라면 예외 발생.
        require(addr_owner == msg.sender || addr_allowed == msg.sender || isOp, "msg.sender does not have transferable token");


        //transfer : change the owner of the token
        //토큰의 주인을 _to 계정으로 변경
        tokenOwners[_tokenId] = _to;
        //safemath 사용해서 balance 감소
        balances[_from] = balances[_from].sub(1);
        //safemath 사용해서 balance 증가
        balances[_to] = balances[_to].add(1);

        //reset approved address
        //erc721표준에 의하면, 이전의 allowance 를 갖고있던 계정을 리셋해줘야한다.
        if (allowance[_tokenId] != address(0)) {
            //null로..
            delete allowance[_tokenId];
        }

        //이벤트 발생.
        emit Transfer(_from, _to, _tokenId);

    }

    /**
    *  기능상 transferfrom과 동일.
    * 다만, _to 계정이 contract 계정인지 체크한다.
    */
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) public payable {

        transferFrom(_from, _to, _tokenId);

        //check if _to is CA

        //토큰을 이전받는 계정이 contract라면
        if (_to.isContract()) {
            // result = onERC721Received의 selector, 함수 signature.
            bytes4 result = ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data);

            //erc165 selector 구하여 일치하지 않으면 에외 발생.
            require(
                result == bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")),
                "receipt of token is NOT completed"
            );
        }

    }
    /**
    *  parameter bytes memory data가 없는 경우 호출하는 함수
    */
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public payable {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    /**
    *
    *
    */
    function approve(address _approved, uint256 _tokenId) external payable {

        address addr_owner = ownerOf(_tokenId);
        //allowance에 tokenid를 주는 것.
        bool isOp = operators[addr_owner][msg.sender];

        //operator에 계정이 또 있다면 approved가 가능.
        require(
            addr_owner == msg.sender || isOp,
            "Not approved by owner"
        );

        allowance[_tokenId] = _approved;

        //approval 이벤트
        emit Approval(addr_owner, _approved, _tokenId);
    }
    /**
    *
    *  token id 안들어감.
    */
    function setApprovalForAll(address _operator, bool _approved) external {
        operators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    //조회용 메소드
    function getApproved(uint256 _tokenId) external view returns (address) {
        return allowance[_tokenId];
    }
    //조회용 메소드
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return operators[_owner][_operator];
    }


    //non-ERC721 standard
    //
    //
    function () external payable {}

    /**
    *  토큰 발행
    *  token id 안들어감.
    */
    function mint(uint8 _x, uint8 _y, uint8 _z) external payable {

        asset memory newAsset = asset(_x, _y, _z);
        //allTokens 배열에 push하면 배열의 길이가 return된다..
        uint tokenId = allTokens.push(newAsset) - 1;
        //token id starts from 0, index of assets array
        tokenOwners[tokenId] = msg.sender;
        balances[msg.sender] = balances[msg.sender].add(1);

        //for enumeration
        allValidTokenIndex[tokenId] = allValidTokenIds.length;
        //index starts from 0
        // allValidTokenIds에는 유효한 토큰만 저장이 된다.
        allValidTokenIds.push(tokenId);

        emit Transfer(address(0), msg.sender, tokenId);
    }

    /**
    *  토큰 소각
    *
    */
    function burn(uint _tokenId) external {

        address addr_owner = ownerOf(_tokenId);

        //소유자 계정과 msg.sender가 일치하는지 확인.
        require(
            addr_owner == msg.sender,
            "msg.sender is NOT the owner of the token"
        );

        //reset approved address allownace에 뭔가가 있다면 지워주어야한다
        //
        if (allowance[_tokenId] != address(0)) {
            delete allowance[_tokenId];
            // tokenId => 0
        }

        //transfer : change the owner of the token, but address(0)
        //address(0)은 address type일때 null을 뜻한다.
        tokenOwners[_tokenId] = address(0);
        //balance도 하나 줄인다.
        balances[msg.sender] = balances[msg.sender].sub(1);

        //for enumeration
        removeInvalidToken(_tokenId);

        // to계정은 address(0)계정이 될것이다.
        emit Transfer(addr_owner, address(0), _tokenId);
    }
    /**
    * 토큰 index 다시 매김.
    *
    */
    function removeInvalidToken(uint256 tokenIdToRemove) private {

        uint256 lastIndex = allValidTokenIds.length.sub(1);
        //토큰id로 index를 가져온다.
        uint256 removeIndex = allValidTokenIndex[tokenIdToRemove];
        //마지막 토큰id
        uint256 lastTokenId = allValidTokenIds[lastIndex];

        //swap
        //삭제될 토큰 자리에 마지막 토큰id를 넣는다.

        allValidTokenIds[removeIndex] = lastTokenId;
        allValidTokenIndex[lastTokenId] = removeIndex;

        //delete
        //Arrays have a length member to hold their number of elements.
        //Dynamic arrays can be resized in storage (not in memory) by changing the .length member.
        //유효한 토큰만 갖고있어야하므로 폐기되는 토큰 길이를 하나 줄인다.
        allValidTokenIds.length = allValidTokenIds.length.sub(1);
        //allValidTokenIndex is private so can't access invalid token by index programmatically
        //폐기되는 토큰의 index는 0으로 만들어준다. 딱히 의미는 없음.
        allValidTokenIndex[tokenIdToRemove] = 0;
    }

    //ERC721Enumerable
    //현재까지 발행된 유효한 토큰 갯수 반환
    function totalSupply() public view returns (uint) {
        //allValidTokenIds -> 유효한 토큰
        return allValidTokenIds.length;
    }

    //ERC721Enumerable
    //index로 토큰id를 가져오는 함수
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply());
        return allValidTokenIds[index];
    }

    //ERC721Metadata
    //토큰 이름을 반환
    function name() external pure returns (string memory) {
        return "EMOJI TOKEN";
    }

    //ERC721Metadata
    //토큰 심볼 반환
    function symbol() external pure returns (string memory) {
        return "EMJ";
    }

    function kill() external onlyOwner {
        selfdestruct(owner);
    }


}

contract ERC721TokenReceiver {

    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) public returns (bytes4);
}
