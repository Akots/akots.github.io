<?php

$availbleUsernameAry = array('test', 'igor', 'sasha');

if (in_array($_GET['name'], $availbleUsernameAry)) {
     echo 0;
} else {
     echo 1;
}
?>